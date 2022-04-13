import FetchProvider from './FetchProvider'
import ConfigurationError, { ConfigurationErrorCode } from './errors/configurationError'
import ResolutionError, { ResolutionErrorCode } from './errors/resolutionError'
import {
  AccountData,
  AccountInfo, AccountRecord, AccountRecordsData,
} from './types/AccountData'
import {
  KeyDescriptor,
  NamingServiceName,
  NamingServiceSource,
  Provider,
} from './types/publicTypes'

export class Das {
  readonly url?: string
  readonly provider: Provider
  readonly name = NamingServiceName.DAS

  constructor (source: NamingServiceSource = {}) {
    this.url = source.url

    if (source.provider) {
      this.provider = source.provider
    }
    else if (source.url) {
      this.provider = new FetchProvider(this.name, source.url)
    }
    else {
      throw new ConfigurationError(ConfigurationErrorCode.UnspecifiedUrl, {
        method: NamingServiceName.DAS
      })
    }
  }

  isSupportedAccount (account: string): boolean {
    return /.+\.bit/.test(account) && account.split('.').every(v => Boolean(v.length))
  }

  async account(account: string): Promise<AccountInfo & {avatar: string}> {
    if (!this.isSupportedAccount(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnsupportedService, {
        account: account,
      })
    }

    const data = await this.provider.request({
      method: 'das_accountInfo',
      params: [{
        account,
      }]
    }) as {data: AccountData}

    if (!data.data) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredAccount, {
        account: account,
      })
    }

    return {
      ...data.data.account_info,
      avatar: `https://identicons.da.systems/identicon/${account}`
    }
  }

  async records(account: string, key?: string): Promise<AccountRecord[]> {
    if (!this.isSupportedAccount(account)) {
      throw new ResolutionError(ResolutionErrorCode.UnsupportedAccount, {
        account: account,
      })
    }

    const res = await this.provider.request({
      method: 'das_accountRecords',
      params: [{
        account,
      }]
    }) as {data: AccountRecordsData}

    const accountData = res.data

    if (!accountData) {
      throw new ResolutionError(ResolutionErrorCode.UnregisteredAccount, {
        account: account,
      })
    }

    if (!key) {
      return accountData.records
    }

    key = key.toLowerCase()
    return accountData.records.filter(record => record.key === key)
  }

  async addrs(account: string, chain: string) {
    return this.records(account, `address.${chain}`)
  }

  async accountsForOwner(address: string, coinType = '60'): Promise<Array<{account: string}>> {
    const res: any = await this.provider.request({
      method: 'das_accountList',
      params: [{
        "type": "blockchain",
        "key_info":{
          "coin_type": coinType,
          "key": address
        }
      }]
    })

    return res?.data?.account_list
  }

  async reverseRecord(descriptor: KeyDescriptor): Promise<string> {
    const res = await this.provider.request({
      method: 'das_reverseRecord',
      params: [descriptor]
    }) as { data: {  account: string } }

    return res.data.account
  }

  /**
   * Transform hash-style account to dot-style account
   * @param inputAccount
   */
  toDottedStyle(inputAccount: string) {
    if (!this.isSupportedAccount(inputAccount)) {
      return inputAccount
    }

    if (!inputAccount.includes('#')) {
      return inputAccount
    }

    const [account, suffix] = inputAccount.split('.')
    const [main, sub] = account.split('#')

    return `${sub}.${main}.${suffix}`
  }

  /**
   * Transform dot-style account to hash-style account
   * @param inputAccount
   */
  toHashedStyle(inputAccount: string) {
    if (!this.isSupportedAccount(inputAccount)) {
      return inputAccount
    }

    if (inputAccount.includes('#')) {
      return inputAccount
    }

    const parts = inputAccount.split('.')

    if (parts.length === 3) {
      const [sub, main, suffix] = parts

      return `${main}#${sub}.${suffix}`
    }

    return inputAccount
  }
}
