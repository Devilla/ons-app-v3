/* eslint-disable prettier/prettier */
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

const useDNSOwner = (name: string, valid: boolean | undefined) => {
  const { ready, getDNSOwner } = useOns()

  const {
    data: dnsOwner,
    status,
    isFetched,
    isLoading,
    internal: { isFetchedAfterMount },
  } = useQuery(['getDNSOwner', name], () => getDNSOwner(name), {
    enabled: ready && valid && !name?.endsWith('.op'),
  })

  const isCachedData = status === 'success' && isFetched && !isFetchedAfterMount

  return {
    dnsOwner,
    isCachedData,
    isLoading,
  }
}

export default useDNSOwner
