import { ZOtp } from "../src/"
import { HashAlgorithms } from "../src/zotp"
import { v4 as uuidv4 } from "uuid"

let secretKey = String(Date.now()) + "-" + uuidv4()
let uri = ""

describe("ZOtp", () => {
	test("Create a zotp", async () => {
		const otp = new ZOtp(secretKey, HashAlgorithms.HMACSHA1, 30)
		const res = otp.generate()
		expect(res).toBe(true)

		expect(otp.getSecretKey()).not.toBe(undefined)
		expect(otp.getAlgorithm()).not.toBe(undefined)
		expect(otp.getPeriod()).not.toBe(undefined)
		expect(otp.keyUri()).not.toBe(undefined)
		uri = otp.keyUri()
		console.log("Created the otp: " + otp.keyUri())
	})

	test("Verify - success", async () => {
		const otp = new ZOtp(secretKey, HashAlgorithms.HMACSHA1, 30)
		const res = otp.generate()
		console.log(`client=${uri}, new=${otp.keyUri()}`)
		expect(otp.verify(uri)).toBe(true)
	})

	test("Verify - fail", async () => {
		// hack
		uri += "xyldyhs"

		const otp = new ZOtp(secretKey, HashAlgorithms.HMACSHA1, 30)
		const res = otp.generate()
		console.log(`client=${uri}, new=${otp.keyUri()}`)
		expect(otp.verify(uri)).toBe(false)
	})
})
