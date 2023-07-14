/* eslint-disable prettier/prettier */
import type { JsonRpcSigner } from '@ethersproject/providers'
import type { TFunction } from 'react-i18next'

import { PublicONS, Transaction, TransactionDisplayItem } from '@app/types'

type Data = { address: string }

const displayItems = (
  { address }: Data,
  t: TFunction<'translation', undefined>,
): TransactionDisplayItem[] => [
  {
    label: 'address',
    value: address,
    type: 'address',
  },
  {
    label: 'action',
    value: t('transaction.description.approveNameWrapper'),
  },
  {
    label: 'info',
    value: t('transaction.info.approveNameWrapper'),
  },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transaction = async (signer: JsonRpcSigner, ons: PublicONS, _: Data) => {
  const registry = (await ons.contracts!.getRegistry()).connect(signer)
  const nameWrapperAddress = (await ons.contracts!.getNameWrapper()).address
  return registry.populateTransaction.setApprovalForAll(nameWrapperAddress, true)
}

export default { displayItems, transaction } as Transaction<Data>
