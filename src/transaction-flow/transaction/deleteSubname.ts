/* eslint-disable prettier/prettier */
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicONS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  contract: 'nameWrapper' | 'registry'
}

const displayItems = (
  { name }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'subname',
    value: name,
    type: 'subname',
  },
  {
    label: 'action',
    value: t(`transaction.description.deleteSubname`),
  },
  {
    label: 'info',
    value: [t('action.delete'), name],
    type: 'list',
  },
]

const transaction = async (signer: JsonRpcSigner, ons: PublicONS, data: Data) => {
  return ons.deleteSubname.populateTransaction(data.name, {
    signer,
    contract: data.contract,
  })
}
export default {
  displayItems,
  transaction,
} as Transaction<Data>
