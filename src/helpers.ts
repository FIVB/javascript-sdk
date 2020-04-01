/**
 * @fivb/sdk
 *
 * @license MIT
 * @copyright FIVB - Romain Lanz <romain.lanz@fivb.com>
 */
import escape from 'lodash/escape';

export function req(query: TemplateStringsArray) {
	const reg = /\$[a-z:]+/gi
	const strings = query[0].split(reg)
	const keys: any[] = []
	let match

	while ((match = reg.exec(query[0]))) {
		const [key, opts]: string[] = match[0].split(':')

		keys.push([key.substr(1), opts])
	}

	return (values?: any) => {
		const result = [strings[0]]

		keys.forEach((key, i) => {
			const value = key[1] === 'safe' ? values[key[0]] : escape(values[key[0]])

			result.push(value, strings[i + 1])
		})

		return result.join('')
	}
}
