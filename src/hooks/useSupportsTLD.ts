/* eslint-disable prettier/prettier */
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

export const useSupportsTLD = (name = '') => {
  const { ready, supportsTLD } = useOns()
  const labels = name?.split('.') || []
  const tld = labels[labels.length - 1]
  return useQuery(['supportedTLD', tld], () => supportsTLD(tld), {
    enabled: ready && !!tld,
  })
}
