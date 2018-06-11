/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */
import { RelationOptionsInterface } from '../Core/Request';
declare class QueryBuilder {
    private $name;
    private $filters;
    private $relations;
    constructor(name: string);
    $registerNestedRelation(name: string, options: RelationOptionsInterface): this;
    /**
     * Add a relation to the query.
     *
     * @param  {string}    name      - Name of the relation
     * @param  {string[]}  fields    - Specific fields to retrieve
     *
     * @return {this}
     */
    with(name: string, fields: string[] | undefined): this;
    /**
     * Filters your request with given parameters.
     *
     * @param  {string}  name   - Name of the filter
     * @param  {string}  value  - Value of the filter
     *
     * @return {this}
     */
    filterBy(name: string, value: string): this;
    /**
     * Returns a record for given parameters.
     *
     * @param  {number}    key     - Specific key to search for
     * @param  {string[]}  fields  - Specific fields to retrieve
     *
     * @return {string}
     */
    find(key: number, fields?: string[]): string;
    /**
     * Fetches the resource.
     *
     * @param  {string[]}  fields   - Specific fields to retrieve
     * @param  {number}    version  - Version to use for the query
     *
     * @return {string}
     */
    fetch(fields?: string[], version?: number): string;
}
export default QueryBuilder;
