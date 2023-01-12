# ZOtp

## About

ZOtp 는 Time-based 기반의 Passcode 이며 TOTP 와 매우 흡사한 방법으로 생성되지만 Secret Code 를 생성하는 알고리즘에서 차이를 갖습니다.

<br>

## Quick Start

### Usage

`Create a zotp`

```jsx
const secretKey = `My SecretKey`
const otp = new ZOtp(secretKey, HashAlgorithms.HMACSHA1, 30)
otp.generate()
console.log(otp.keyUri())
```

`Verify a zotp`

```jsx
const clientOtpUri = "onepass://1.1/zotp?key=stXJ9nPCAp7jbwuYkdLufJ/dLC0&value=69Utln6ziuDI8kUjjT9Z2nZBGV8"

const secretKey = `My SecretKey`
const otp = new ZOtp(secretKey, HashAlgorithms.HMACSHA1, 30)
otp.generate()
console.log(otp.verify(clientOtpUri)) // true if valid
```

<br>

## API

`Constructor`

```jsx
constructor(secretKey: SecretKey, algorithm?: HashAlgorithms, period?: number)
```

-   `secretKey` The secret key used by hash algorithm
-   `algorithm` (Optional) The algorithm used for calculating the HMAC. The default value is HMACSHA1.
-   `period` (Optional) Available duration as onepass code (seconds). The default value is 30 secs.

`Generate a zotp`

```jsx
public generate(): boolean
```

`Verify a zotp`

```jsx
public generate(uri:KeyUri): boolean
```

-   `uri` The key URI of OTP to compare with mine

`Get KeyUri`

```jsx
// onepass://1.1/zotp?key=stXJ9nPCAp7jbwuYkdLufJ/dLC0&value=69Utln6ziuDI8kUjjT9Z2nZBGV8
public keyUri(): KeyUri
```

`Get secretKey`

```jsx
public getSecretKey(): SecretKey
```

`Get Hash Algorithms`

```jsx
export enum HashAlgorithms {
	HMACSHA1 = "HMACSHA1",
	HMACSHA256 = "HMACSHA256",
}
public getAlgorithm(): HashAlgorithms
```

`Get Peroid`

```jsx
public getPeriod(): number
```

<br>

## Test

Run Test

```
yarn test
```
