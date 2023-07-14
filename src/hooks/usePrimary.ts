/* eslint-disable prettier/prettier */
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

export const usePrimary = (address: string, skip?: any) => {
  const { ready, getName } = useOns()

  const {
    data,
    isLoading: loading,
    status,
  } = useQuery(['getName', address], () => getName(address), {
    enabled: ready && !skip && address !== '',
    cacheTime: 60,
  })

  return { name: data?.match ? data.name : null, loading, status }
}
