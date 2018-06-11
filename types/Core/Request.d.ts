/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */
declare class Request {
    /**
     * Type of the request
     */
    private $type;
    /**
     * Filters used in the request
     */
    private $filters;
    /**
     * Relations used in the request
     */
    private $relations;
    /**
     * Attributes used in the request
     */
    private $attributes;
    /**
     * Constructor.
     *
     * @constructor
     * @param  {string}  type - Type of the request
     */
    constructor(type: string);
    /**
     * Syntax helper to create a relation.
     *
     * @param  {string}                    name     - Name of the relation
     * @param  {RelationOptionsInterface}  options  - Options of the relation
     *
     * @return {RelationInterface}
     */
    static createRelation(name: string, options: RelationOptionsInterface): RelationInterface;
    /**
     * Adds an attribute in the request.
     *
     * @param  {string}         name   - Name of the attribute
     * @param  {string|number}  value  - Value of the attribute
     *
     * @return {this}
     */
    addAttribute(name: string, value: string | number): this;
    /**
     * Adds a filter to the request.
     *
     * @param  {string}         name   - Name of the filter
     * @param  {string|number}  value  - Value of the filter
     *
     * @return {this}
     */
    addFilter(name: string, value: string | number): this;
    /**
     * Adds a relation to the request.
     *
     * @param  {string}             name     - Name of the relation
     * @param  {RelationOptionsInterface}  options  - Options of the relation
     *
     * @return {this}
     */
    addRelation(name: string, options: RelationOptionsInterface): this;
    /**
     * Transforms filters map to valide XML element.
     *
     * @return {string}
     */
    $filtersToString(): string;
    /**
     * Transforms one relation to valide XML elements.
     *
     * @return {string}
     */
    $relationToString(key: string, options: RelationInterface | RelationOptionsInterface): string;
    /**
     * Transforms relations map to valide XML elements.
     *
     * @return {string}
     */
    $relationsToString(): string;
    /**
     * Convert the request to string.
     *
     * @return {string}
     */
    toString(): string;
}
export interface RelationOptionsInterface {
    fields?: string[];
    $relations?: [RelationInterface];
}
export interface RelationInterface extends RelationOptionsInterface {
    key: string;
}
export default Request;
