/* eslint-disable prettier/prettier */
import { useOns } from '@app/utils/OnsProvider'
import { emptyAddress } from '@app/utils/constants'

import { useChainId } from './useChainId'

export const useWrapperExists = (): boolean => {
  const { ready, getContractAddress } = useOns()
  const chainId = useChainId()
  const nameWrapperAddress = getContractAddress(String(chainId) as any)('NameWrapper')
  return !!(ready && nameWrapperAddress && nameWrapperAddress !== emptyAddress)
}
