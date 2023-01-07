import { URL } from "url"
import { HashAlgorithms } from "./onepass-types"

export class OnepassParser {
	private _urlObj: URL

	constructor(url: string) {
		this._urlObj = new URL(url)
	}

	get url() {
		return this._urlObj.href
	}

	get version() {
		return this._urlObj.hostname
	}

	get label() {
		return this._urlObj.pathname.replace("/", "")
	}

	get provider() {
		const s = this.label.split(":")
		return s.length == 2 ? s[0] : undefined
	}

	get account() {
		const s = this.label.split(":")
		return s.length == 2 ? s[1] : s[0]
	}

	get secret() {
		return this._urlObj.searchParams.get("secret") || ""
	}

	get period() {
		const p = this._urlObj.searchParams.get("period")
		return p == null ? 30 : parseInt(p)
	}

	get algorithm() {
		const p = this._urlObj.searchParams.get("algorithm")
		return p == null || p == HashAlgorithms.HMACSHA1 ? HashAlgorithms.HMACSHA1 : HashAlgorithms.HMACSHA256
	}
}
