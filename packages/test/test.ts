import { Onepass, OnepassParser, HashAlgorithms } from "../src/"
import { OnepassAuthenticator } from "../src/onepass"

describe("Onepass", () => {
	test("Onepass Generation", async () => {
		const SECRET_KEY = "1666329317842-98bdd778-f907-4675-9829-b033e8a28bde"
		const onepass = new Onepass(SECRET_KEY, "soma-lounge:iot@zigbang.com")
		onepass.generate()
		expect(onepass.keyUri()).not.toBe(undefined)
		console.log("Created the onepass: " + onepass.keyUri())
	})

	test("Onepass Verficiation", async () => {
		const SECRET_KEY = "1666329317842-98bdd778-f907-4675-9829-b033e8a28bde"
		const clientOnepass = new Onepass(SECRET_KEY, "soma-lounge:iot@zigbang.com")
		clientOnepass.generate()
		expect(clientOnepass.keyUri()).not.toBe(undefined)

		const authenticator = new OnepassAuthenticator()
		const res = authenticator.validate(clientOnepass, SECRET_KEY)
		expect(res).toBe(true)
	})
})
