/* eslint-disable prettier/prettier */
import type { JsonRpcSigner } from '@ethersproject/providers'
import { utils } from 'ethers'
import { useQuery, useSigner } from 'wagmi'

import {
  Transaction,
  TransactionName,
  transactions as _transactions,
  makeTransactionItem,
} from '@app/transaction-flow/transaction'
import { useOns } from '@app/utils/OnsProvider'

type ONS = ReturnType<typeof useOns>
type TransactionItem = ReturnType<typeof makeTransactionItem>

export const fetchEstimateWithConfig =
  (transactionsObj: Transaction, signer: JsonRpcSigner, ons: ONS) =>
  async (transaction: TransactionItem) => {
    const transactionName = transaction.name as TransactionName
    const populatedTransaction = await transactionsObj[transactionName].transaction(
      signer as JsonRpcSigner,
      ons,
      transaction.data,
    )
    const gasLimit = await signer!.estimateGas(populatedTransaction)
    return {
      name: transactionName,
      gasLimit,
    }
  }

export const useEstimateGasLimitForTransactions = (
  transactions: TransactionItem[],
  isEnabled: boolean = true,
  extraKeys: string[] = [],
) => {
  const keys = transactions.map((t) => t.name)

  const ons = useOns()
  const { ready: onsReady } = ons
  const { data: signer, isLoading: isSignerLoading } = useSigner()

  const { data, ...results } = useQuery(
    ['use-estimate-gas-limit-for-transactions', ...keys, ...extraKeys],
    async () => {
      if (!signer) throw new Error('No signer available')
      if (!ons) throw new Error('onsjs did not load')
      const fetchEstimate = fetchEstimateWithConfig(
        _transactions,
        signer as JsonRpcSigner,
        ons as ONS,
      )
      const estimates = await Promise.all(transactions.map(fetchEstimate))
      const total = estimates.map((r) => r.gasLimit).reduce((a, b) => a.add(b))
      const gasPrice = await signer.getGasPrice()
      const gasCost = gasPrice.mul(total)

      return {
        estimates,
        gasCost,
        gasLimit: total,
      }
    },
    {
      enabled: onsReady && !isSignerLoading && isEnabled,
    },
  )

  return {
    gasLimit: data?.gasLimit,
    gasCostEth: utils.formatEther(data?.gasCost || 0),
    estimates: data?.estimates,
    ...results,
  }
}
