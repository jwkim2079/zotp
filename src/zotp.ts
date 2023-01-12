/**
 * Zigbang IoT Platform - OTP
 *
 *
 */

import CryptoJS from "crypto-js"
import { URL } from "url"

/**
 * SecretKey based UUID String.
 */
export declare type SecretKey = string

/**
 * Key Uri String.
 */
export declare type KeyUri = string

/**
 * Supported algorithms
 */
export enum HashAlgorithms {
	HMACSHA1 = "HMACSHA1",
	HMACSHA256 = "HMACSHA256",
}

export class ZOtp {
	DEFAULT_PERIOD: number = 30

	private mac: string
	private uri: KeyUri

	/**
	 * Constructor
	 * @param secretKey The secret key used by hash algorithm
	 * @param algorithm (Optional) The algorithm used for calculating the HMAC. The default value is HMACSHA1.
	 * @param duration: (Optional) Available duration as onepass code (seconds). The default value is 30 secs.
	 */
	constructor(private secretKey: SecretKey, private algorithm?: HashAlgorithms, private period?: number) {
		if (this.algorithm == undefined) this.algorithm = HashAlgorithms.HMACSHA1
		if (this.period == undefined) this.period = this.DEFAULT_PERIOD

		//this.printProperties()
	}

	/**
	 * Generates an OTP
	 *
	 * @returns true if successful
	 */
	public generate(): boolean {
		const key = this.generateHMAC(this.secretKey, this.secretKey, this.algorithm)
		this.mac = this.generateHMAC(this.secretKey + this.getTimeSlice(this.period), this.secretKey, this.algorithm)
		this.uri = `onepass://1.1/zotp?key=${key}&value=${this.mac}`
		return true
	}

	/**
	 *
	 * @param targetUri The target key URI to verify with my hashed code
	 * @returns true if the verification is successful
	 */
	public verify(targetUri: KeyUri): boolean {
		const urlObj = new URL(targetUri)
		const value = urlObj.searchParams.get("value") || ""
		return this.mac == value
	}

	/**
	 * @returns The onepass Key URI
	 */
	public keyUri(): KeyUri {
		return this.uri
	}

	/**
	 *
	 * @returns The secrect key
	 */
	public getSecretKey(): SecretKey {
		return this.secretKey
	}

	/**
	 *
	 * @returns The algorithm
	 */
	public getAlgorithm(): HashAlgorithms {
		return this.algorithm
	}

	/**
	 *
	 * @returns The period
	 */
	public getPeriod(): number {
		return this.period
	}

	/**-----------------------------------------------------------------------------------------
	 * private
	 -----------------------------------------------------------------------------------------*/
	private generateHMAC(message: string, secretKey: SecretKey, algorithm: HashAlgorithms): string {
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
}
