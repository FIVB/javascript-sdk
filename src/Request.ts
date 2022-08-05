import { dset } from 'dset';
import { cloneDeep } from 'lodash-es';

type RelationOptions = {
	properties: string[];
	relations?: { [key: string]: RelationOptions };
	customAttributes?: Record<string, string>;
};

type NodeOptions = {
	attributes: Record<string, unknown>;
	nodes?: { [key: string]: NodeOptions };
};

function sanitizeHtmlEntities(value: unknown) {
  if (!value) {
    return
  }

  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export class Request {
	private readonly type: RequestType;
	private readonly propertiesTag: PropertiesTagName = 'Properties';
	private rootAttributes = new Map<string, unknown>();
	private relations: Record<string, RelationOptions> = {};
	private nodes: Record<string, NodeOptions> = {};
	private inlineFilters = new Map<string, unknown>();
	private tagFilters = new Set<string>();

	constructor(type: RequestType, properties?: string[], propertiesTag: PropertiesTagName = 'Properties') {
		this.type = type;
		this.propertiesTag = propertiesTag;

		if (properties) {
			this.addRootAttribute(propertiesTag, properties.join(' '));
		}
	}

	public clone(): this {
		return cloneDeep(this);
	}

	public addRootAttribute(name: string, value: string | number): this {
		if (typeof value === 'number') {
			this.rootAttributes.set(name, value.toString());
			return this;
		}

		this.rootAttributes.set(name, value);

		return this;
	}

	public addRelation(name: string, properties: string[] | null, customAttributes?: Record<string, string>): this {
		const path = name.split('.').join('.relations.');
		dset(this.relations, path, { properties, customAttributes });

		return this;
	}

	public addNode(name: string, attributes: Record<string, unknown>): this {
		const path = name.split('.').join('.nodes.');
		dset(this.nodes, path, { attributes });

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
			this.rootAttributes.size > 0 ? ' ' + this.attributesToString(this.rootAttributes) : ''
		}>`;

		if (this.inlineFilters.size > 0 || this.tagFilters.size > 0) {
			request += this.filtersToString();
		}

		if (Object.keys(this.nodes).length > 0) {
			request += this.nodesToString();
		}

		if (Object.keys(this.relations).length > 0) {
			request += this.relationsToString();
		}

		request += '</Request>';

		return request;
	}

	private attributesToString(attributes: Map<string, unknown>): string {
		return Array.from(attributes)
			.map(([key, value]) => `${key}="${sanitizeHtmlEntities(value) || ''}"`)
			.join(' ');
	}

	private relationsToString(): string {
		return Object.keys(this.relations)
			.map((key) => this.relationToString(key, this.relations[key]))
			.join('');
	}

	private relationToString(name: string, relation: RelationOptions): string {
		let output = `<Relation Name="${name}"`;

		if (relation.properties?.length > 0) {
			output += ` ${this.propertiesTag}="${relation.properties.join(' ')}"`;
		}

		if (relation.customAttributes) {
			Object.entries(relation.customAttributes).forEach(([attribute, value]) => {
				output += ` ${attribute}="${sanitizeHtmlEntities(value)}"`;
			});
		}

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

	private nodesToString(): string {
		return Object.keys(this.nodes)
			.map((key) => this.nodeToString(key, this.nodes[key]))
			.join('');
	}

	private nodeToString(name: string, node: NodeOptions): string {
		let output = `<${name}`;

		if (Object.keys(node.attributes).length > 0) {
			Object.entries(node.attributes).forEach(([attribute, value]) => {
				output += ` ${attribute}="${sanitizeHtmlEntities(value) || ''}"`;
			});
		}

		if (node.nodes) {
			output += '>';
			output += Object.keys(node.nodes!)
				.map((key) => this.nodeToString(key, node.nodes![key]))
				.join('');
			output += `</${name}>`;
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

export enum Models {
	Application = 'Application',
	ApplicationRequestStatistic = 'ApplicationRequestStatistic',
	Article = 'Article',
	ArticleText = 'ArticleText',
	BankAccount = 'BankAccount',
	BeachMatch = 'BeachMatch',
	BeachLive = 'BeachLive',
	BeachRanking = 'BeachRanking',
	BeachRankingParameters = 'BeachRankingParameters',
	BeachStartingPointsRanking = 'BeachStartingPointsRanking',
	BeachRound = 'BeachRound',
	BeachStatistic = 'BeachStatistic',
	BeachTeam = 'BeachTeam',
	BeachTeamMate = 'BeachTeamMate',
	BeachTemplate = 'BeachTemplate',
	BeachTournament = 'BeachTournament',
	Coach = 'Coach',
	Confederation = 'Confederation',
	CourseAttender = 'CourseAttender',
	DevelopmentProject = 'DevelopmentProject',
	DevelopmentProjectProgressReport = 'DevelopmentProjectProgressReport',
	DayScheduleEntry = 'DayScheduleEntry',
	Document = 'Document',
	Event = 'Event',
	EventAccreditation = 'EventAccreditation',
	EventOfficial = 'EventOfficial',
	EventReferee = 'EventReferee',
	ExportDefinition = 'ExportDefinition',
	Federation = 'Federation',
	FederationVolleyDivision = 'FederationVolleyDivision',
	FederationVolleySeason = 'FederationVolleySeason',
	FederationVolleySeasonDivision = 'FederationVolleySeasonDivision',
	Image = 'Image',
	Match = 'Match',
	MediaOrganization = 'MediaOrganization',
	MediaPerson = 'MediaPerson',
	MedicalPerson = 'MedicalPerson',
	Official = 'Official',
	Person = 'Person',
	Phase = 'Phase',
	PhaseRanking = 'PhaseRanking',
	PhaseTeam = 'PhaseTeam',
	Player = 'Player',
	PlayersAgent = 'PlayersAgent',
	PlayerInjury = 'PlayerInjury',
	PlayerAccountingEntry = 'PlayerAccountingEntry',
	PressRelease = 'PressRelease',
	PressReleaseText = 'PressReleaseText',
	Referee = 'Referee',
	RefereeMatchesByYear = 'RefereeMatchesByYear',
	Round = 'Round',
	RoundRanking = 'RoundRanking',
	Season = 'Season',
	Tag = 'Tag',
	Tournament = 'Tournament',
	TournamentPlayer = 'TournamentPlayer',
	TournamentRanking = 'TournamentRanking',
	TournamentTeam = 'TournamentTeam',
	User = 'User',
	VolleyClub = 'VolleyClub',
	VolleyClubTeam = 'VolleyClubTeam',
	VolleyClubTeamPlayer = 'VolleyClubTeamPlayer',
	VolleyClubTeamSeasonDivision = 'VolleyClubTeamSeasonDivision',
	VolleyHall = 'VolleyHall',
	VolleyMatch = 'VolleyMatch',
	VolleyMatchRefereeEvaluation = 'VolleyMatchRefereeEvaluation',
	VolleyPlayer = 'VolleyPlayer',
	VolleyPool = 'VolleyPool',
	VolleyRankingDefinition = 'VolleyRankingDefinition',
	VolleyTeam = 'VolleyTeam',
	VolleyTournament = 'VolleyTournament',
	VolleyTransfer = 'VolleyTransfer',
	VolleyTransferContract = 'VolleyTransferContract',
	VolleyTransferFee = 'VolleyTransferFee',
	VolleyTransferPayment = 'VolleyTransferPayment',
	VolleyTransferSeason = 'VolleyTransferSeason',
}

export type GettableEntity =
	| Models.Application
	| Models.Article
	| Models.BankAccount
	| Models.BeachMatch
	| Models.BeachLive
	| Models.BeachRanking
	| Models.BeachStartingPointsRanking
	| Models.BeachRound
	| Models.BeachTeam
	| Models.BeachTemplate
	| Models.BeachTournament
	| Models.Coach
	| Models.DevelopmentProject
	| Models.DevelopmentProjectProgressReport
	| Models.DayScheduleEntry
	| Models.Document
	| Models.Event
	| Models.EventAccreditation
	| Models.EventOfficial
	| Models.EventReferee
	| Models.ExportDefinition
	| Models.Federation
	| Models.FederationVolleyDivision
	| Models.FederationVolleySeason
	| Models.FederationVolleySeasonDivision
	| Models.Image
	| Models.Match
	| Models.MediaOrganization
	| Models.MediaPerson
	| Models.MedicalPerson
	| Models.Person
	| Models.Phase
	| Models.PhaseRanking
	| Models.Player
	| Models.PlayersAgent
	| Models.PlayerInjury
	| Models.PressRelease
	| Models.PressReleaseText
	| Models.Referee
	| Models.Round
	| Models.RoundRanking
	| Models.Tournament
	| Models.TournamentPlayer
	| Models.TournamentRanking
	| Models.TournamentTeam
	| Models.User
	| Models.VolleyClub
	| Models.VolleyClubTeam
	| Models.VolleyClubTeamPlayer
	| Models.VolleyHall
	| Models.VolleyMatch
	| Models.VolleyMatchRefereeEvaluation
	| Models.VolleyPlayer
	| Models.VolleyPool
	| Models.VolleyTeam
	| Models.VolleyTournament
	| Models.VolleyTransfer
	| Models.VolleyTransferContract
	| Models.VolleyTransferFee
	| Models.VolleyTransferPayment;

export type ListableEntity =
	| Models.ApplicationRequestStatistic
	| Models.Article
	| Models.BankAccount
	| Models.BeachMatch
	| Models.BeachRanking
	| Models.BeachRankingParameters
	| Models.BeachRound
	| Models.BeachStatistic
	| Models.BeachTeam
	| Models.BeachTeamMate
	| Models.BeachTemplate
	| Models.BeachTournament
	| Models.Coach
	| Models.Confederation
	| Models.CourseAttender
	| Models.DevelopmentProject
	| Models.DevelopmentProjectProgressReport
	| Models.DayScheduleEntry
	| Models.Document
	| Models.Event
	| Models.EventAccreditation
	| Models.EventOfficial
	| Models.EventReferee
	| Models.ExportDefinition
	| Models.Federation
	| Models.FederationVolleyDivision
	| Models.FederationVolleySeason
	| Models.FederationVolleySeasonDivision
	| Models.Image
	| Models.MediaOrganization
	| Models.MediaPerson
	| Models.MedicalPerson
	| Models.Official
	| Models.Person
	| Models.Phase
	| Models.PhaseTeam
	| Models.Player
	| Models.PlayerInjury
	| Models.PlayerAccountingEntry
	| Models.PressRelease
	| Models.PressReleaseText
	| Models.Referee
	| Models.RefereeMatchesByYear
	| Models.Round
	| Models.Tag
	| Models.Tournament
	| Models.TournamentPlayer
	| Models.TournamentTeam
	| Models.User
	| Models.VolleyClub
	| Models.VolleyClubTeam
	| Models.VolleyClubTeamPlayer
	| Models.VolleyClubTeamSeasonDivision
	| Models.VolleyHall
	| Models.VolleyMatch
	| Models.VolleyMatchRefereeEvaluation
	| Models.VolleyPlayer
	| Models.VolleyRankingDefinition
	| Models.VolleyTournament
	| Models.VolleyTransfer
	| Models.VolleyTransferContract
	| Models.VolleyTransferPayment
	| Models.VolleyTransferSeason
	| Models.Season;

export type SavableEntity =
	| Models.Article
	| Models.ArticleText
	| Models.BankAccount
	| Models.BeachMatch
	| Models.BeachTeam
	| Models.BeachTournament
	| Models.Coach
	| Models.Confederation
	| Models.CourseAttender
	| Models.DevelopmentProject
	| Models.DevelopmentProjectProgressReport
	| Models.DayScheduleEntry
	| Models.Document
	| Models.Event
	| Models.EventAccreditation
	| Models.EventOfficial
	| Models.EventReferee
	| Models.Federation
	| Models.FederationVolleyDivision
	| Models.FederationVolleySeason
	| Models.FederationVolleySeasonDivision
	| Models.Image
	| Models.Match
	| Models.MediaPerson
	| Models.MedicalPerson
	| Models.Official
	| Models.Person
	| Models.Phase
	| Models.PhaseTeam
	| Models.Player
	| Models.PlayerAccountingEntry
	| Models.PlayerInjury
	| Models.PressRelease
	| Models.PressReleaseText
	| Models.Referee
	| Models.RefereeMatchesByYear
	| Models.Tournament
	| Models.TournamentPlayer
	| Models.TournamentTeam
	| Models.User
	| Models.VolleyClub
	| Models.VolleyClubTeam
	| Models.VolleyClubTeamPlayer
	| Models.VolleyHall
	| Models.VolleyMatch
	| Models.VolleyMatchRefereeEvaluation
	| Models.VolleyPlayer
	| Models.VolleyPool
	| Models.VolleyTeam
	| Models.VolleyTournament
	| Models.VolleyTransfer
	| Models.VolleyTransferContract
	| Models.VolleyTransferPayment;

export type GetEntityListRequest = `Get${ListableEntity}List`;
export type GetEntityRequest = `Get${GettableEntity}`;
export type SaveEntityRequest = `Save${SavableEntity}`;
export type RequestType = GetEntityRequest | GetEntityListRequest | SaveEntityRequest;
export type PropertiesTagName = 'Properties' | 'Fields';
