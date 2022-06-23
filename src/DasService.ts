import FetchProvider from './FetchProvider'
import { NamingService } from './NamingService'
import ConfigurationError, { ConfigurationErrorCode } from './errors/configurationError'
import ResolutionError, { ResolutionErrorCode } from './errors/resolutionError'
import {
  AccountData,
  AccountInfo,
  AccountInfoWithRecords,
  AccountRecord,
  AccountRecordsData, AccountRecordType,
  AccountRecordTypes,
} from './types/AccountData'
import { BlockchainNetworkUrlMap, DasSupportedNetwork } from './types/index'
import {
  ChainId,
  CoinType,
  CryptoRecords,
  DasSource, KeyDescriptor,
  NamingServiceName,
  Provider,
  ResolutionMethod,
} from './types/publicTypes'

export interface ConstructedAccount {
  account: string,
  avatar: string,

  profile: Record<string, AccountRecord>,
  address: Record<string, AccountRecord>,
  dweb: Record<string, AccountRecord>,
  custom: Record<string, AccountRecord>,

  profiles: AccountRecord[],
  addresses: AccountRecord[],
  dwebs: AccountRecord[],
  customs: AccountRecord[],

  records: AccountRecord[],
}

let jsonrpcId = 0
export class DasService extends NamingService {
  static readonly UrlMap: BlockchainNetworkUrlMap = {
    'mainnet': 'https://indexer-v1.did.id',
    'testnet': 'http://47.243.90.165:8223',
    'aggron': 'http://47.243.90.165:8223',
  }
  static tickerToDescriptorMap: Record<string, KeyDescriptor> = {
    'ETH': {
      type: 'blockchain',
      key_info: {
        coin_type: CoinType.ETH,
      }
    },
    'BNB': {
      type: 'blockchain',
      key_info: {
        coin_type: CoinType.ETH,
        chain_id: ChainId.BSC
      }
    },
    'TRX': {
      type: 'blockchain',
      key_info: {
        coin_type: CoinType.TRX,
      }
    },
    'MATIC': {
      type: 'blockchain',
      key_info: {
        coin_type: CoinType.MATIC,
        chain_id: ChainId.Polygon
      }
    }
  }

  readonly name = NamingServiceName.DAS
  readonly network: string // check if there is some numeric network id todo:
  readonly url: string | undefined
  readonly provider: Provider // temporarily not in use todo:

  constructor (source: DasSource = {}) {
    super();

    if (!(source.url || source.provider)) {
      throw new ConfigurationError(ConfigurationErrorCode.UnspecifiedUrl, {
        method: NamingServiceName.DAS
      })
    }

    if (!source.network) {
      source.network = 'mainnet'
    }

    if (!DasSupportedNetwork.guard(source.network)) {
      throw new ConfigurationError(ConfigurationErrorCode.UnsupportedNetwork, {
        method: NamingServiceName.DAS,
      })
    }

    this.network = source.network
    this.url = source.url
    this.provider = source.provider || new FetchProvider(this.name, this.url as string)
  }

  static async autonetwork(source?: DasSource): Promise<DasService> {
    if (!source) {
      source = {
        url: DasService.UrlMap['mainnet'],
        network: 'mainnet'
      }
    }
    else if (source.network && !source.url) {
      source.url = DasService.UrlMap[source.network]
    }

    return new DasService(source)
  }

  serviceName (): ResolutionMethod {
    return this.name
  }

  isSupportedAccount (account: string): boolean {
    return /.+\.bit/.test(account) && account.split('.').every(v => Boolean(v.length))
  }

  // todo: implement namehash
  namehash (account: string): string {
    if (!this.isSupportedAccount(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredAccount, {
        account: account,
      })
    }

    return ''
  }

  childhash (_parentHash: string, label: string): string {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      account: label,
      methodName: 'childhash'
    })
  }

  async owner (account: string): Promise<string> {
    const accountData = await this.getAccountData(account)

    return accountData.owner_key
  }

  async resolver (account: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      account: account,
      methodName: 'resolver',
    })
  }

  async record(account: string, key: string): Promise<string> {
    key = key.toLowerCase()
    const returnee = (await this.allRecords(account))[key]

    if (!returnee) {
      throw new ResolutionError(ResolutionErrorCode.RecordNotFound, {
        account: account,
        recordName: key,
      })
    }

    return returnee
  }

  async records (account: string, keys: string[]): Promise<CryptoRecords> {
    const records = await this.allRecords(account)

    return keys.reduce((returnee: CryptoRecords, key) => {
      returnee[key] = records[key] || ''
      return returnee
    }, {})
  }

  async allRecords (account: string): Promise<Record<string, string>> {
    if (!this.isSupportedAccount(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnsupportedService, {
        account: account,
      })
    }

    const res = await this.provider.request({
      id: ++jsonrpcId,
      jsonrpc: `2.0`,
      method: 'das_accountRecords',
      params: [{
        account,
      }]
    }) as {data: AccountRecordsData}

    const data = res.data

    if (data) {
      const records = data.records

      const returnee: CryptoRecords = {}

      records.forEach(record => {
        returnee[record.key.toLowerCase()] = record.value
      })

      return returnee
    }
    // no records
    else {
      return {}
    }
  }

  async reverse(address: string, currencyTicker: string): Promise<string | null> {
    const descriptor = DasService.tickerToDescriptorMap[currencyTicker]
    if (!descriptor) {
      throw new Error(`Das currently does not support ${currencyTicker}`)
    }

    const accounts = await this.getReverseAccount({
      type: descriptor.type,
      key_info: {
        ...descriptor.key_info,
        key: address
      }
    })

    return accounts[0]
  }

  async isRegistered(account: string): Promise<boolean> {
    const accountData = await this.getAccountData(account);

    return Boolean(accountData);
  }

  twitter (account: string): Promise<string> {
    throw new ResolutionError(ResolutionErrorCode.UnsupportedMethod, {
      account: account,
      methodName: 'twitter'
    })
  }
  /* -------- custom methods --------- */

  async addr(account: string, ticker: string) {
    return await this.record(account, `address.${ticker}`)
  }

  async account(account: string) {
    const accountData = await this.getAccountDataAndRecords(account)

    const profiles = accountData.records.filter(record => record.type === AccountRecordTypes.profile)
    const addresses = accountData.records.filter(record => record.type === AccountRecordTypes.address)
    const dwebs = accountData.records.filter(record => record.type === AccountRecordTypes.dweb)
    const customs = accountData.records.filter(record => record.type === AccountRecordTypes.custom)

    function resolveOneFromRecords(records: AccountRecord[]) {
      return records.reduce((profile, record) => {
        profile[record.strippedKey] = record
        return profile
      }, {} as Record<string, AccountRecord>)
    }

    return {
      account: accountData.account,
      avatar: `https://display.did.id/identicon/${account}`,

      profile: resolveOneFromRecords(profiles),
      address: resolveOneFromRecords(addresses),
      dweb: resolveOneFromRecords(dwebs),
      custom: resolveOneFromRecords(customs),

      profiles,
      addresses,
      dwebs,
      customs,

      records: accountData.records,
    }
  }

  async getReverseAccount(descriptor: KeyDescriptor): Promise<string> {
    const data = await this.provider.request({
      id: ++jsonrpcId,
      jsonrpc: `2.0`,
      method: 'das_reverseRecord',
      params: [descriptor],
    }) as { data: {  account: string } }

    return data.data.account
  }

  async getAccountDataAndRecords(account: string): Promise<AccountInfoWithRecords> {
    const accountData = await this.getAccountData(account) as AccountInfoWithRecords
    accountData.records = await this.getRecordsData(account)

    return accountData
  }

  async getAccountData(account: string): Promise<AccountInfo> {
    const data = await this.provider.request({
      id: ++jsonrpcId,
      jsonrpc: `2.0`,
      method: 'das_accountInfo',
      params: [{
        account,
      }]
    }) as {data: AccountData}

    if (!data.data) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredAccount, {
        account: account,
      });
    }

    return data.data.account_info
  }

  async getRecordsData(account: string) {
    if (!this.isSupportedAccount(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnsupportedService, {
        account: account,
      })
    }

    const res = await this.provider.request({
      id: ++jsonrpcId,
      jsonrpc: `2.0`,
      method: 'das_accountRecords',
      params: [{
        account,
      }]
    }) as {data: AccountRecordsData}

    const records = res.data.records

    if (records) {
      records.forEach(record => {
        // the raw data is string, like '300'
        record.ttl = Number(record.ttl)
        const keyParts = record.key.split('.')
        const type = keyParts.shift() as AccountRecordType
        const strippedKey = keyParts.join('.')

        record.type = type
        record.strippedKey = strippedKey
      })

    }

    return records
  }
}
