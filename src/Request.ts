import { dset } from 'dset';

type RelationOptions = {
	properties: string[];
	relations?: { [key: string]: RelationOptions };
};

export class Request {
	private type: RequestType;
	private propertiesTag: PropertiesTagName = 'Properties';
	private rootAttributes = new Map<string, string>();
	private relations: Record<string, RelationOptions> = {};
	private inlineFilters = new Map<string, string>();
	private tagFilters = new Set<string>();

	constructor(type: RequestType, properties?: string[], propertiesTag: PropertiesTagName = 'Properties') {
		this.type = type;
		this.propertiesTag = propertiesTag;

		if (properties) {
			this.addRootAttribute(propertiesTag, properties.join(' '));
		}
	}

	public addRootAttribute(name: string, value: string | number): this {
		if (typeof value === 'number') {
			this.rootAttributes.set(name, value.toString());
			return this;
		}

		this.rootAttributes.set(name, value);

		return this;
	}

	public addRelation(name: string, properties: string[]): this {
		const path = name.split('.').join('.relations.');
		dset(this.relations, path, { properties });

		return this;
	}

	public addInlineFilter(name: string, value: string | number): this {
		if (typeof value === 'number') {
			this.inlineFilters.set(name, value.toString());
			return this;
		}

		this.inlineFilters.set(name, value);

		return this;
	}

	public addTagFilter(tag: string): this {
		this.tagFilters.add(tag);

		return this;
	}

	public toString(): string {
		let request = `<Request Type="${this.type}"${
			this.rootAttributes.size > 0 && ' ' + this.attributesToString(this.rootAttributes)
		}>`;

		if (this.inlineFilters.size > 0 || this.tagFilters.size > 0) {
			request += this.filtersToString();
		}

		if (Object.keys(this.relations).length > 0) {
			request += this.relationsToString();
		}

		request += '</Request>';

		return request;
	}

	private attributesToString(attributes: Map<string, string>): string {
		return Array.from(attributes)
			.map(([key, value]) => `${key}="${value}"`)
			.join(' ');
	}

	private relationsToString(): string {
		return Object.keys(this.relations)
			.map((key) => this.relationToString(key, this.relations[key]))
			.join('');
	}

	private relationToString(name: string, relation: RelationOptions): string {
		let output = `<Relation Name="${name}" ${this.propertiesTag}="${relation.properties.join(' ')}"`;

		if (relation.relations) {
			output += '>';
			output += Object.keys(relation.relations!)
				.map((key) => this.relationToString(key, relation.relations![key]))
				.join('');
			output += '</Relation>';
		} else {
			output += '/>';
		}

		return output;
	}

	private filtersToString(): string {
		let output = '<Filter';

		if (this.inlineFilters.size > 0) {
			output += ' ' + this.attributesToString(this.inlineFilters);
		}

		if (this.tagFilters.size > 0) {
			output += '>';
			output += `<Tags Mode="MySqlBoolean">${Array.from(this.tagFilters).join(' ')}</Tags>`;
			output += '</Filter>';

			return output;
		}

		output += '/>';

		return output;
	}
}

export type Entity = 'Article' | 'VolleyTransfer';
export type GetListRequest = `Get${Entity}List`;
export type GetRequest = `Get${Entity}`;
export type RequestType = GetListRequest | GetRequest;
export type PropertiesTagName = 'Properties' | 'Fields';
