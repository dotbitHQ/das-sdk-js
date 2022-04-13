import test from 'ava'

import { Das } from '../Das'
import { ChainId, CoinType } from '../types/publicTypes'

let das: Das

test.before(() => {
  das = new Das({
    url: 'https://indexer-not-use-in-production-env.da.systems/',
  })
})

test(
  'das.account()',
  async (t, account) => {
    const accountInfo = await das.account(account)

    t.truthy(accountInfo)
    t.is(accountInfo.account, account)
    t.is(accountInfo.avatar, `https://identicons.da.systems/identicon/${account}`)
  },
  'phone.bit'
)

test(
  'das.isSupportedAccount()',
  async (t, account) => {
    const isSupported = das.isSupportedAccount(account)

    t.true(isSupported)
  },
  'a.phone.bit'
)

test(
  'das.records()',
  async (t, account) => {
    const records = await das.records(account)
    const filteredRecords = records.filter(record => record.key === 'address.eth')

    t.true(records.length > 0)

    const ethRecords = await das.records(account, 'address.eth')
    t.deepEqual(ethRecords, filteredRecords)
    t.is(ethRecords.length, filteredRecords.length)
  },
  'phone.bit',
)

test(
  'das.addrs()',
  async (t, account) => {
    const addrs = await das.addrs(account, 'ETH')
    const records = await das.records(account, 'address.eth')

    t.true(addrs.length > 0)
    t.is(addrs.length, records.length)
    t.deepEqual(addrs, records)
  },
  'phone.bit',
)

test(
  'das.reverseRecord()',
  async (t, address) => {
    const account = await das.reverseRecord({
      type: 'blockchain',
      key_info: {
        coin_type: CoinType.ETH,
        chain_id: ChainId.ETH,
        key: address
      }
    })

    t.is(account, 'imac.bit')
  },
  '0x1d643fac9a463c9d544506006a6348c234da485f',
)

test(
  'das.accountsForOwner() ETH',
  async (t, address) => {
    const accounts = await das.accountsForOwner(address)

    t.true(accounts.length > 0)
    t.truthy(accounts[0].account)
  },
  '0x1d643fac9a463c9d544506006a6348c234da485f',
)

test(
  'das.accountsForOwner() Tron',
  async (t, address) => {
    const accounts = await das.accountsForOwner(address, '195')

    t.true(accounts.length > 0)
    t.truthy(accounts[0].account)
  },
  'TPhEgBBVpNZZ4vpeEvh2jMo9WejuTbb5a2',
)

test(
  'das.accountsForOwner() empty',
  async (t, address) => {
    const accounts = await das.accountsForOwner(address)

    t.falsy(accounts.length > 0)
  },
  'TPhEgBBVpNZZ4vpeEvh2jMo9WejuTbb5a2',
)

test(
  'das.toDottedStyle() phone#123.bit',
  async (t, account) => {
    const accounts = await das.toDottedStyle(account)

    t.is(accounts, '123.phone.bit')

  },
  'phone#123.bit',
)

test(
  'das.toDottedStyle() 123.phone.bit',
  async (t, account) => {
    const accounts = await das.toDottedStyle(account)

    t.is(accounts, '123.phone.bit')

  },
  '123.phone.bit',
)

test(
  'das.toHashedStyle() 123.phone.bit',
  async (t, account) => {
    const accounts = await das.toHashedStyle(account)

    t.is(accounts, 'phone#123.bit')

  },
  '123.phone.bit',
)

test(
  'das.toHashedStyle() phone#123.bit',
  async (t, account) => {
    const accounts = await das.toHashedStyle(account)

    t.is(accounts, 'phone#123.bit')

  },
  'phone#123.bit',
)
