/* eslint-disable prettier/prettier */
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

export const useExpiry = (name: string, skip?: boolean) => {
  const { ready, getExpiry } = useOns()

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery(
    ['useExpiry', name],
    async () => {
      const results = await getExpiry(name)
      return {
        expiry: results?.expiry?.valueOf(),
        gracePeriod: results?.gracePeriod,
      }
    },
    {
      enabled: !skip && ready,
    },
  )

  return {
    expiry: {
      expiry: data?.expiry ? new Date(data.expiry) : undefined,
      gracePeriod: data?.gracePeriod,
    },
    loading,
    error,
  }
}
