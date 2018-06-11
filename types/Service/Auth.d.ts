/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */
declare class Auth {
    /**
     * Attempts to retrieve a JSON Web Token
     * with given credentials.
     *
     * @static
     * @param  {string}  username  - Username of the user
     * @param  {string}  password  - Password of the user
     *
     * @return {string}
     */
    static attempt(username: string, password: string): string;
    /**
     * Logout the user.
     *
     * @static
     * @param  {string|undefined}  accessToken  - Token to use for the validation
     *
     * @return {string}
     */
    static logout(accessToken?: string): string;
    /**
     * Validates the given accessToken.
     *
     * @static
     * @param  {string|undefined}  accessToken  - Token to use for the validation
     *
     * @return {string}
     */
    static validateToken(accessToken?: string): string;
    /**
     * Retrieves a new accessToken with the given refreshToken.
     *
     * @static
     * @param  {string}  refreshToken  - Token to use to refresh
     *
     * @return {string}
     */
    static refreshToken(refreshToken: string): string;
}
export default Auth;
