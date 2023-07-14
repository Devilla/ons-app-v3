/* eslint-disable prettier/prettier */
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

export const useGetHistory = (name: string, skip?: any) => {
  const { ready, getHistory } = useOns()

  const {
    data: history,
    isLoading,
    status,
    isFetched,
    internal: { isFetchedAfterMount },
  } = useQuery(['graph', 'getHistory', name], () => getHistory(name), {
    enabled: ready && !skip && name !== '',
  })

  return {
    history,
    isLoading,
    status,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
