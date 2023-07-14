/* eslint-disable prettier/prettier */
import { ONS } from '@opdomains/onsjs'
import type { ContractName } from '@opdomains/onsjs/contracts/types'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useProvider } from 'wagmi'

const opts: ConstructorParameters<typeof ONS>[0] = {}

if (process.env.NEXT_PUBLIC_PROVIDER && process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES) {
  const deploymentAddresses = JSON.parse(process.env.NEXT_PUBLIC_DEPLOYMENT_ADDRESSES!) as Record<
    ContractName | 'ONSRegistry',
    string
  >
  opts.getContractAddress = () => (contractName) =>
    deploymentAddresses[contractName === 'ONSRegistry' ? 'ONSRegistry' : contractName]
}

if (process.env.NEXT_PUBLIC_GRAPH_URI) {
  opts.graphURI = process.env.NEXT_PUBLIC_GRAPH_URI
}

const defaultValue: ONS = new ONS(opts)
defaultValue.staticNetwork = true

const OnsContext = createContext({ ...defaultValue, ready: false })

const OnsProvider = ({ children }: { children: React.ReactNode }) => {
  const provider = useProvider()
  const onsWithCurrentProvider = useMemo(() => defaultValue, [])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    onsWithCurrentProvider.setProvider(provider as any).then(() => setReady(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider])

  return (
    <OnsContext.Provider
      value={useMemo(() => ({ ...onsWithCurrentProvider, ready }), [onsWithCurrentProvider, ready])}
    >
      {children}
    </OnsContext.Provider>
  )
}

function useOns() {
  const context = useContext(OnsContext)
  return context
}
export { useOns, OnsProvider }
