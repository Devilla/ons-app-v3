/* eslint-disable prettier/prettier */
import { namehash } from '@opdomains/onsjs/utils/normalise'
import { useQuery } from 'wagmi'

import { useOns } from '@app/utils/OnsProvider'

const query = `
  query getResolverExists($id: String!) {
    resolver(id: $id) {
      id
    }
  }
`

const useResolverExists = (name: string, address: string) => {
  const { ready, gqlInstance } = useOns()
  const { data, isLoading } = useQuery(
    ['graph', 'getResolverExists', name],
    async () => {
      const { resolver } = await gqlInstance.request(query, { id: `${address}-${namehash(name)}` })
      return !!resolver
    },
    {
      enabled: ready && name !== '',
    },
  )

  return {
    data,
    isLoading,
  }
}

export default useResolverExists
