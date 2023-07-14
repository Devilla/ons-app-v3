/* eslint-disable prettier/prettier */
import { BigNumber } from 'ethers'

import type { ReturnedONS } from '@app/types/index'

import { emptyAddress } from './constants'
import { checkOP2LDName, checkOPName } from './utils'

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'premium'
  | 'available'
  | 'short'
  | 'notImported'
  | 'notOwned'
  | 'unsupportedTLD'

export const getRegistrationStatus = ({
  name,
  ownerData,
  wrapperData,
  expiryData,
  priceData,
  supportedTLD,
}: {
  name: string | null
  ownerData?: ReturnedONS['getOwner']
  wrapperData?: ReturnedONS['getWrapperData']
  expiryData?: ReturnedONS['getExpiry']
  priceData?: ReturnedONS['getPrice']
  supportedTLD?: boolean
}): RegistrationStatus => {
  const labels = name?.split('.') || []
  const isDotOP = checkOPName(labels)
  const isDotOp2ld = checkOP2LDName(isDotOP, labels, true)  // checkOPName

  if (isDotOp2ld && labels[0].length < 3) {
    return 'short'
  }

  if (!ownerData && !wrapperData) return 'invalid'

  if (!isDotOP && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isDotOp2ld) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData as {
        expiry: Date | string
        gracePeriod: number
      }
      const expiry = new Date(_expiry)
      if (expiry.getTime() > Date.now()) {
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod > Date.now()) {
        return 'gracePeriod'
      }
      const { premium } = priceData as {
        base: BigNumber
        premium: BigNumber
      }
      if (premium.gt(0)) {
        return 'premium'
      }
    }
    return 'available'
  }
  if (ownerData && ownerData.owner !== emptyAddress) {
    return 'registered'
  }
  if (labels.length > 2) {
    return 'notOwned'
  }
  return 'notImported'
}
