/* eslint-disable prettier/prettier */
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicONS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = {
  name: string
  newOwner: string
  isOwner: boolean
}

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
    value: t('details.sendName.transferController', { ns: 'profile' }),
  },
]

const transaction = (signer: JsonRpcSigner, ons: PublicONS, data: Data) => {
  const tx = ons.transferController.populateTransaction(data.name, {
    newOwner: data.newOwner,
    isOwner: data.isOwner,
    signer,
  })
  return tx
}

export default {
  displayItems,
  transaction,
  backToInput: true,
} as Transaction<Data>
