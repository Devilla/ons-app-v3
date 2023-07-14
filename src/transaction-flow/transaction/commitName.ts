/* eslint-disable prettier/prettier */
import { BaseRegistrationParams } from '@opdomains/onsjs/utils/registerHelpers'
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicONS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = BaseRegistrationParams & { name: string }

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'name',
    value: name,
    type: 'name',
  },
  {
    label: 'action',
    value: t('transaction.description.commitName'),
  },
  {
    label: 'info',
    value: t('transaction.info.commitName'),
  },
]

const transaction = async (signer: JsonRpcSigner, ons: PublicONS, data: Data) => {
  const { customData: _, ...tx } = await ons.commitName.populateTransaction(data.name, {
    signer,
    ...data,
  })
  return tx
}

export default { displayItems, transaction } as Transaction<Data>
