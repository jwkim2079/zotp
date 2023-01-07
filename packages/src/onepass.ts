import CryptoJS from "crypto-js"
import { v4 as uuidv4 } from "uuid"
import { SecretKey, HashAlgorithms, OnepassKeyUri } from "./onepass-types"
import { OnepassParser } from "./onepass-parser"

export class Onepass {
	DEFAULT_PERIOD: number = 30

	private secretKey: SecretKey
	private label: string
	private algorithm: HashAlgorithms
	private period: number
	private uri: string

	/**
	 * Constructor
	 * @param _secretKey the secret key which will be used by hash algorithm
	 * @param _label It used to identify which account a key is associated with.
	 *    format: provider(or service):email
	 *    example: soma-lounge:iot@zigbang.com
	 * @param algorithm (Optional) The algorithm used for calculating the HMAC. The default value is HMACSHA1.
	 * @param duration: (Optional) Available duration as onepass code (seconds). The default value is 30 secs.
	 *
	 * @returns The onepass code as Uri format
	 */
	constructor(_secretKey: SecretKey, _label: string, _algorithm?: HashAlgorithms, _period?: number) {
		this.secretKey = _secretKey
		this.label = _label
		this.algorithm = _algorithm
		this.period = _period

		if (_algorithm == undefined) this.algorithm = HashAlgorithms.HMACSHA1
		if (_period == undefined) this.period = this.DEFAULT_PERIOD

		//this.printProperties()
	}

	/**
	 * Generates an Onepass URI
	 *
	 * @returns The onepass URI
	 */
	public generate(): OnepassKeyUri {
		const mac = this.generateMac(this.label + this.getTimeSlice(this.period), this.secretKey, this.algorithm)
		const [issuer, account] = this.parseLabel(this.label)

		this.uri = `onepass://1.1/${this.label}?secret=${mac}&period=${this.period}&algorithm=${this.algorithm}`
		if (issuer != undefined) this.uri += `&issuer=${issuer}`
		return encodeURI(this.uri)
	}

	/**
	 * Get an Onepass URI created by generate()
	 *
	 * @returns The onepass URI
	 */
	public keyUri(): OnepassKeyUri {
		return this.uri
	}

	/**
	 * Generates a secret (Hash based Message Authentication Code)
	 * @param message the original message
	 * @param secretKey the secret key which will be used by hash algorithm
	 * @param algorithm The algorithm used for calculating the HMAC - HMACSHA1, HMACSHA256
	 *
	 * @returns the hashed message authentication code encoded as base64
	 */
	private generateMac(message: string, secretKey: SecretKey, algorithm: HashAlgorithms): string {
		return algorithm == HashAlgorithms.HMACSHA1
			? CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(message, secretKey)).replace("=", "").replace("+", "")
			: CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, secretKey)).replace("=", "").replace("+", "")
	}

	private getTimeSlice(duration: number): string {
		const epoch = Math.round(new Date().getTime() / 1000.0)
		return this.leftpad(this.dec2hex(Math.floor(epoch / duration)), 16, "0")
	}

	private leftpad(s: string, len: number, pad: string) {
		if (len + 1 >= s.length) {
			s = Array(len + 1 - s.length).join(pad) + s
		}
		return s
	}

	private dec2hex(s: number) {
		return (s < 15.5 ? "0" : "") + Math.round(s).toString(16)
	}

	private parseLabel(label: string) {
		const res = label.split(":")
		return res.length == 1 ? ([undefined, res[0]] as const) : ([res[0], res[1]] as const)
	}

	private printProperties() {
		console.log(`secretKey=${this.secretKey}`)
		console.log(`label=${this.label}`)
		console.log(`algorithm=${this.algorithm}`)
		console.log(`period=${this.period}`)
		console.log(`keyUri=${this.uri}`)
	}
}

/**
 * Options
 */
export interface OnepassOptions {
	/**
	 * The algorithm used for calculating the HMAC.
	 */
	algorithm?: HashAlgorithms
	/**
	 * Available period (seconds).
	 */
	period?: number
}

export class OnepassAuthenticator {
	/**
	 * Generates a random Secret Key based UUID.
	 */
	public generateSecretKey(): SecretKey {
		return String(Date.now()) + "-" + uuidv4()
	}

	public generateOnepass(secretKey: SecretKey, label: string, options?: OnepassOptions): Onepass {
		return new Onepass(
			secretKey,
			label,
			options != undefined && options.algorithm != undefined ? options.algorithm : undefined,
			options != undefined && options.period != undefined ? options.period : undefined,
		)
	}

	public validate(onepass: Onepass, secretKey: SecretKey): boolean {
		const parser = new OnepassParser(onepass.keyUri())
		const newOnepass = new Onepass(secretKey, parser.label, parser.algorithm, parser.period)
		newOnepass.generate()

		console.log(`Onepass Validation: received=${onepass.keyUri()}`)
		console.log(`Onepass Validation: created=${newOnepass.keyUri()}`)
		return onepass.keyUri() === newOnepass.keyUri()
	}
}
