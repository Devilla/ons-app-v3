/* eslint-disable prettier/prettier */
import { toUtf8Bytes } from 'ethers/lib/utils'

import { networkName } from './constants'

export const getSupportedNetworkName = (networkId: number) =>
  networkName[`${networkId}` as keyof typeof networkName] || 'unknown'

const baseMetadataURL = process.env.NEXT_PUBLIC_PROVIDER
  ? 'https://metadata.opnames.org'
  : 'https://metadata.opnames.org'

// eslint-disable-next-line consistent-return
export function imageUrlUnknownRecord(name: string, network: number) {
  const supported = getSupportedNetworkName(network)

  return `${baseMetadataURL}/${supported}/avatar/${name}?timestamp=${Date.now()}`
}

export function onsNftImageUrl(name: string, network: number, regAddr: string) {
  const supported = getSupportedNetworkName(network)

  return `${baseMetadataURL}/${supported}/${regAddr}/${name}/image`
}

export const shortenAddress = (address = '', maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address
  }

  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`
}

export const secondsToDays = (seconds: number) => Math.floor(seconds / (60 * 60 * 24))

export const yearsToSeconds = (years: number) => years * 60 * 60 * 24 * 365

export const secondsToYears = (seconds: number) => seconds / (60 * 60 * 24 * 365)

export const formatExpiry = (expiry: Date) => `
${expiry.toLocaleDateString(undefined, {
  month: 'long',
})} ${expiry.getDate()}, ${expiry.getFullYear()}`

export const makeEtherscanLink = (hash: string, network?: string) =>
  `https://${!network || network === 'mainnet' ? '' : `${network}.`}optimistic.etherscan.io/tx/${hash}`

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const checkDNSName = (name: string): boolean => {
  const labels = name?.split('.')

  return !!labels && labels[labels.length - 1] !== 'op'
}

export const checkOPName = (labels: string[]) => labels[labels.length - 1] === 'op' // checkOPName

export const checkOP2LDName = (isDotOP: boolean, labels: string[], canBeShort?: boolean) =>
  isDotOP && labels.length === 2 && (canBeShort || labels[0].length >= 3)

export const checkSubname = (name: string) => name.split('.').length > 2

export const isLabelTooLong = (label: string) => {
  const bytes = toUtf8Bytes(label)
  return bytes.byteLength > 255
}

export const getTestId = (props: any, fallback: string): string => {
  return props['data-testid'] ? String(props['data-testid']) : fallback
}
