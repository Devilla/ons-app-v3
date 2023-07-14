/* eslint-disable prettier/prettier */
import { BigNumber, ethers } from 'ethers'
import { useProvider, useQuery } from 'wagmi'

import AggregatorInterface from '@ensdomains/ens-contracts/build/contracts/AggregatorInterface.json'

import { useChainId } from '@app/hooks/useChainId'
import { useOns } from '@app/utils/OnsProvider'

const ORACLE_ONS = '0x13e3Ee699D1909E989722E753853AE30b17e08c5'
const ORACLE_OPTIMISM = '0x13e3Ee699D1909E989722E753853AE30b17e08c5' // price

export const useEthPrice = () => {
  const provider = useProvider()
  const { getAddr, ready } = useOns()
  const chainId = useChainId()

  const { data, isLoading: loading } = useQuery(
    ['use-eth-price'],
    async () => {
      let address
      // OPTIMISM
      if (chainId === 10) {
        address = ORACLE_OPTIMISM
      } else {
        address = await getAddr(ORACLE_ONS)
      }
      if (!address) throw new Error('Contract address not found')
      if (typeof address !== 'string') throw new Error('Contract address is wrong type')
      const oracle = new ethers.Contract(address, AggregatorInterface, provider)
      const latest = (await oracle.latestAnswer()) as BigNumber
      return latest
    },
    {
      enabled: !!provider && ready,
    },
  )
  return {
    data,
    loading,
  }
}
