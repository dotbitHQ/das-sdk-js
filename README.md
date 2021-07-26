# das-sdk

A library to resolve DAS accounts

## Install
```shell
npm install das-sdk
```

## Prerequisite
### Set up DAS Account Indexer
[das_account_indexer](https://github.com/DeAccountSystems/das_account_indexer) is the storage layer and API layer of DAS.

It read DAS data from CKB node and keep them in locally.  

It provides a JSON-RPC, with which we can read DAS data in our business.

Please set up a [https://github.com/DeAccountSystems/das_account_indexer](https://github.com/DeAccountSystems/das_account_indexer) on your own server and keep it running.

## Initialize
```javascript
import Das from 'das-sdk'

const das = new Das({
  url: 'https://{{endpoint.to.das.account.indexer}}',
})

das.records('dasloveckb.bit').then(console.log)
/* ==>
  [{
  key: 'address.eth',
  label: 'coinbase',
  value: '0x1234...4567',
  ttl: 300,
  avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit'
}, {
  key: 'address.eth',
  label: 'onchain',
  value: '0x2345...6789',
  ttl: 300,
  avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit'
}]
*/
```

## Configuration
To set up das-sdk, you need to provide `url`.  

- `url` is the JSON-RPC endpoint of [das_account_indexer](https://github.com/DeAccountSystems/das_account_indexer).

We suggest that developers run their own [das_account_indexer](https://github.com/DeAccountSystems/das_account_indexer).

> However, if you are new to DAS and want to test das-sdk, you can use this indexer running by the DAS team as a start: `https://indexer.da.systems`

## Interfaces

```typescript
interface DasSource {
  url: string, // The Das indexer url
}

export interface AccountRecord {
  key: string, // The key of the record, in the form like `address.eth`, `profile.email`, 'custom.xx.yy`.
  label: string, // The label of the record. There may be multiple records for the same `key`, users can use `label` to distinguish them.  
  value: string, // The value of the record. Developers should valid the validity of the value before using them. 
  ttl: number, // Time to live for the record.

  avatar: string, // The DAS avatar generated by [identicons](https://github.com/DeAccountSystems/identicons)
}

interface AccountData {
  account: string, // abc.bit
  
  avatar: string, // The DAS avatar
  
  manager_address: string,
  manager_address_chain: string, // Currenly support ETH/TRX
  owner_address: string,
  owner_address_chain: string,
  
  records: AccountRecord[] // All the records of the account
}

// DAS API
abstract class Das {
  constructor (source?: DasSource);

  // Returns account full data, 
  account(account: string): Promise<AccountData>

  // Returns the record list for the given key of the DAS account
  // All records will return if the `key` is empty.
  records(account: string, key?: string): Promise<AccountRecord[]>
}
```

## Examples
```javascript
import Das from 'das-sdk'

const das = new Das({
  url: 'https://indexer.da.systems',
})

// Get all records for the key `address.eth`
das.records('dasloveckb.bit', 'address.eth').then(console.log)
/*
[{
  key: 'address.eth',
  label: 'coinbase',
  value: '0x1234...4567',
  ttl: 300,
  avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit''
}, {
  key: 'address.eth',
  label: 'onchain',
  value: '0x2345...6789',
  ttl: 300,
  avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit'
}]
*/

// Get all the data for an account.
das.account('dasloveckb.bit').then(console.log)
/** ==>
 {
  account: 'dasloveckb.bit',
  avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit',

  owner_address: '0x1234...5678',
  owner_address_chain: 'ETH',
  manager_address: 'T1234...6789',
  manager_address_chain: 'TRX',

  records: [
    {
      key: 'address.eth',
      label: '',
      value: '0x1234...5678',
      ttl: 300,
      avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit',
    },
    {
      key: 'profile.email',
      label: 'personal email',
      value: 'das@google.com',
      ttl: 300,
      avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit',
    },
    {
      key: 'profile.email',
      label: 'business email',
      value: 'das@da.systems',
      ttl: 300,
      avatar: 'https://identicons.da.systems/identicon/dasloveckb.bit',
    }
  ]
}
 */
```

## Error Handling
Please checkout [./src/errors](./src/errors) for error descriptions.
