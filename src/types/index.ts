/* eslint-disable prettier/prettier */
import type { ONS } from '@opdomains/onsjs'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { PopulatedTransaction } from 'ethers'
import { ComponentProps } from 'react'
import type { TFunction } from 'react-i18next'

import { Helper } from '@opdomains/thorin'

export type Profile = NonNullable<Awaited<ReturnType<ONS['getProfile']>>>

export type ProfileRecords = NonNullable<Profile['records']>

export type RecordItem = NonNullable<ProfileRecords['texts']>[number]

export type Name = NonNullable<Awaited<ReturnType<ONS['getNames']>>>[0]

interface TransactionDisplayItemBase {
  label: string
  fade?: boolean
  shrink?: boolean
  useRawLabel?: boolean
}

export interface TransactionDisplayItemSingle extends TransactionDisplayItemBase {
  type?: 'name' | 'subname' | 'address'
  value: string
}

export interface TransactionDisplayItemList extends TransactionDisplayItemBase {
  type: 'list'
  value: string[]
}

export interface TransactionDisplayItemRecords extends TransactionDisplayItemBase {
  type: 'records'
  value: [string, string][]
}

export type TransactionDisplayItem =
  | TransactionDisplayItemSingle
  | TransactionDisplayItemList
  | TransactionDisplayItemRecords

export type TransactionDisplayItemTypes = 'name' | 'address' | 'list' | 'records'

type PublicInterface<Type> = { [Key in keyof Type]: Type[Key] }

export type ProfileEditorType = {
  _avatar?: File
  avatar?: string
  banner?: string
  website?: string
  general: {
    [key: string]: string
  }
  accounts: {
    [key: string]: string
  }
  address: {
    [key: string]: string
  }
  other: {
    [key: string]: string
  }
}
export type PublicONS = PublicInterface<ONS>

export type HelperProps = ComponentProps<typeof Helper>
export type ReturnedONS = { [key in keyof PublicONS]: Awaited<ReturnType<PublicONS[key]>> }

export interface Transaction<Data> {
  displayItems: (data: any, t: TFunction<'translation', undefined>) => TransactionDisplayItem[]
  transaction: (signer: JsonRpcSigner, ons: PublicONS, data: Data) => Promise<PopulatedTransaction>
  helper?: (data: any, t: TFunction<'translation', undefined>) => undefined | HelperProps
  backToInput?: boolean
}

export type FuseObj = {
  CAN_DO_EVERYTHING: boolean
  CANNOT_UNWRAP: boolean
  CANNOT_BURN_FUSES: boolean
  CANNOT_TRANSFER: boolean
  CANNOT_SET_RESOLVER: boolean
  CANNOT_SET_TTL: boolean
  CANNOT_CREATE_SUBDOMAIN: boolean
  PARENT_CANNOT_CONTROL: boolean
}

export type EthAddress = string

export type CurrencyUnit = 'eth' | 'fiat'
export type FiatUnit = 'usd'
export type CurrencyDisplay = 'eth' | FiatUnit
