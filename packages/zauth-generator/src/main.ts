import { ZHashAlgorithms, ZIoTAuthenticator } from './ziotauth-authenticator'
import { ZIoTAuthKeyUri } from './ziotauth-keyuri'

// main
;(async () => {
  const authenticator = new ZIoTAuthenticator()
  const uri = authenticator.generateKeyUri(
    'soma-lounge:jwkim@zigbang.com',
    '1666329317842-98bdd778-f907-4675-9829-b033e8a28bde'
  )
  const keyuri = new ZIoTAuthKeyUri(uri)
  console.log('url=' + keyuri.url)
  console.log('version=' + keyuri.version)
  console.log('label=' + keyuri.label)
  console.log('secret=' + keyuri.secret)
  console.log('duration=' + keyuri.duration)
  console.log('algorithm=' + keyuri.algorithm)

  console.log(
    authenticator.verify(
      keyuri.secret,
      'soma-lounge:jwkim@zigbang.com',
      '1666329317842-98bdd778-f907-4675-9829-b033e8a28bde'
    )
  )
})()
