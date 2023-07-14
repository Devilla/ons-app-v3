/* eslint-disable prettier/prettier */
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

export const useGetWrapperData = (name: string, skip?: any) => {
  const { ready, getWrapperData } = useOns()

  const {
    data: wrapperData,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['getWrapperData', name], () => getWrapperData(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    wrapperData,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
