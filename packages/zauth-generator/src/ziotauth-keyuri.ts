import { URL } from 'url'

export class ZIoTAuthKeyUri {
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
    return this._urlObj.pathname.replace('/', '')
  }

  get secret() {
    return this._urlObj.searchParams.get('secret')
  }

  get duration() {
    return this._urlObj.searchParams.get('duration')
  }

  get algorithm() {
    return this._urlObj.searchParams.get('algorithm')
  }
}
