import test from 'ava'

import { DasService } from '../DasService'
import ResolutionError, { ResolutionErrorCode } from '../errors/resolutionError'

let dasService: DasService

test.before(() => {
  dasService = new DasService({
    url: DasService.UrlMap['mainnet'],
    network: 'mainnet'
  })
})

test(
  'dasService.getAccountData()',
  async (t, account: string) => {
    const accountData = await dasService.getAccountData(account)

    t.not(accountData, null)
    t.is(accountData.account, account)
  },
  'phone.bit',
);

test(
  'dasService.record()',
  async (t, account: string, address: string) => {
    const error: ResolutionError = await t.throwsAsync(dasService.record(account, 'eth'))
    t.true(error.code === ResolutionErrorCode.RecordNotFound)

    const ethAddress = await dasService.record(account, 'address.eth')
    const ethAddressWithUpperCaseKey = await dasService.record(account, 'address.ETH')

    t.is(ethAddress, address)
    t.true(ethAddress === ethAddressWithUpperCaseKey)
  },
  'phone.bit',
  '0xd9b2a3a7c056a77ef21a7706b3c763093edf76de'
)

test(
  'dasService.records()',
  async (t, account: string, keys: string[]) => {
    const records = await dasService.records(account, keys)

    t.not(Object.keys(records).length, 0)
    t.is(records['address.eth'], '0xd9b2a3a7c056a77ef21a7706b3c763093edf76de')
  },
  'phone.bit',
  ['address.eth', 'profile.phone', 'address.btc'],
)

test(
  'dasService.account()',
  async (t, account) => {
    const accountRes = await dasService.account(account)

    t.is(accountRes.avatar, 'https://identicons.did.id/identicon/phone.bit')
    t.is(accountRes.account, 'phone.bit')

    t.true(accountRes.records.length > 0)

    t.true(Array.isArray(accountRes.profiles))

    t.is(typeof accountRes.profile, 'object')
    t.truthy(accountRes.address['eth'].value)
  },
  'phone.bit',
)

test(
  'dasService.autonetwork()',
  async (t) => {
    const das = await DasService.autonetwork()

    t.is(das.network, 'mainnet')
    t.is(das.url, 'https://indexer-not-use-in-production-env.did.id')
  },
)
