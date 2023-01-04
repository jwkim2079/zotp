import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'

/**
 * UUID String.
 */
export declare type ZSecretKey = string

/**
 * Auth Uri String.
 */
export declare type ZAuthUri = string

/**
 * Supported algorithms
 */
export declare const enum ZHashAlgorithms {
  HMACSHA1 = 'HMACSHA1',
  HMACSHA256 = 'HMACSHA256',
}

export declare const enum ZAuthOptionsDefaultValue {
  DEFAULT_DURATION = 30,
  DEFAULT_ALGORITHM = ZHashAlgorithms.HMACSHA1,
}

/**
 * Options
 */
export interface ZAuthOptions {
  /**
   * The algorithm used for calculating the HMAC.
   */
  algorithm?: ZHashAlgorithms
  /**
   * Available duration as token (seconds).
   */
  duration?: number
}

export class ZIoTAuthenticator {
  /**
   * Generates a random Secret Key based on UUID.
   */
  public generateSecret(): ZSecretKey {
    return String(Date.now()) + '-' + uuidv4()
  }

  /**
   * Generates a MAC based SHA1
   */
  public generateHMAC(message: string, secret: ZSecretKey, algorithm: ZHashAlgorithms): string {
    return algorithm == ZHashAlgorithms.HMACSHA1
      ? CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(message, secret)).replace('=', '').replace('+', '')
      : CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(message, secret)).replace('=', '').replace('+', '')
  }

  /**
   * Generates the auth-uri based Zigbang IoT Platform Auth Protocol
   * @param label It used to identify which account a key is associated with.
   *    format: domain:email
   *    example: soma-lounge:jwkim@zigbang.com
   * @param secret The secret key
   * @param options
   *    algorithm: The algorithm used for calculating the HMAC. The default value is "HMACSHA1".
   *    duration: Available duration as token (seconds). The default value is 30 secs.
   */
  public generateKeyUri(label: string, secret: ZSecretKey, options?: ZAuthOptions): string {
    const [duration, alg] = this.checkOptions(options)
    const mac = this.generateHMAC(label + this.getTimeSlice(duration), secret, alg)
    let auth = `ziotauth://1.1/${label}?secret=${mac}`
    if (options == undefined) return auth

    if (options.algorithm != undefined) auth += `&algorithm=${alg}`
    if (options.duration != undefined) auth += `&duration=${duration}`
    return auth
  }

  /**
   * Verify the token
   */
  public verify(token: string, label: string, secret: ZSecretKey, options?: ZAuthOptions): boolean {
    const [duration, alg] = this.checkOptions(options)
    return token == this.generateHMAC(label + this.getTimeSlice(duration), secret, alg)
  }

  /**
   * Utils
   */
  private checkOptions(options: ZAuthOptions) {
    const duration =
      options != undefined && options.duration != undefined
        ? options.duration
        : ZAuthOptionsDefaultValue.DEFAULT_DURATION
    const alg: any =
      options != undefined && options.algorithm != undefined
        ? options.algorithm
        : ZAuthOptionsDefaultValue.DEFAULT_ALGORITHM

    return [duration, alg] as const
  }

  private getTimeSlice(duration: number): string {
    const epoch = Math.round(new Date().getTime() / 1000.0)
    return this.leftpad(this.dec2hex(Math.floor(epoch / duration)), 16, '0')
  }

  private leftpad(s: string, len: number, pad: string) {
    if (len + 1 >= s.length) {
      s = Array(len + 1 - s.length).join(pad) + s
    }
    return s
  }

  private dec2hex(s: number) {
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16)
  }
}
