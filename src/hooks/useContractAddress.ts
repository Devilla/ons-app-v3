/* eslint-disable prettier/prettier */
import { ContractName } from '@opdomains/onsjs/contracts/types'

import { useOns } from '@app/utils/OnsProvider'

import { useChainId } from './useChainId'

export const useContractAddress = (contractName: ContractName) => {
  const chainId = useChainId()
  const { getContractAddress } = useOns()
  return getContractAddress(chainId as any)(contractName)
}
