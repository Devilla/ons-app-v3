/* eslint-disable prettier/prettier */
import { truncateFormat } from '@opdomains/onsjs/utils/format'
import { useQuery } from 'wagmi'

import { ReturnedONS } from '@app/types'
import { useOns } from '@app/utils/OnsProvider'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { checkOP2LDName, checkOPName, isLabelTooLong, yearsToSeconds } from '@app/utils/utils'

import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'
import { useWrapperExists } from './useWrapperExists'

type BaseBatchReturn = [ReturnedONS['getOwner'], ReturnedONS['getWrapperData']]
type OP2LDBatchReturn = [...BaseBatchReturn, ReturnedONS['getExpiry'], ReturnedONS['getPrice']]

export const useBasicName = (name?: string | null, normalised?: boolean) => {
  const ons = useOns()

  const { name: _normalisedName, valid, labelCount } = useValidate(name!, !name)

  const normalisedName = normalised ? name! : _normalisedName

  const { data: supportedTLD } = useSupportsTLD(normalisedName)

  const {
    data: batchData,
    isLoading: batchLoading,
    isFetched,
    internal: { isFetchedAfterMount },
    status,
  } = useQuery(
    ['batch', 'getOwner', 'getExpiry', normalisedName],
    (): Promise<[] | BaseBatchReturn | OP2LDBatchReturn | undefined> => {
      const labels = normalisedName.split('.')
      const isDotOP = checkOPName(labels)
      if (checkOP2LDName(isDotOP, labels, true)) {
        if (labels[0].length < 3) {
          return Promise.resolve([])
        }
        return ons.batch(
          ons.getOwner.batch(normalisedName),
          ons.getWrapperData.batch(normalisedName),
          ons.getExpiry.batch(normalisedName),
          ons.getPrice.batch(labels[0], yearsToSeconds(1), false),
        )
      }

      return ons.batch(ons.getOwner.batch(normalisedName), ons.getWrapperData.batch(normalisedName))
    },
    {
      enabled: !!(ons.ready && name && valid),
    },
  )

  const [ownerData, wrapperData, expiryData, priceData] = batchData || []

  const registrationStatus = batchData
    ? getRegistrationStatus({
        name: normalisedName,
        ownerData,
        wrapperData,
        expiryData,
        priceData,
        supportedTLD,
      })
    : undefined

  const expiryDate = expiryData?.expiry ? new Date(expiryData.expiry) : undefined

  const gracePeriodEndDate =
    expiryDate && expiryData?.gracePeriod
      ? new Date(expiryDate.getTime() + expiryData.gracePeriod)
      : undefined

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const nameWrapperExists = useWrapperExists()
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  const isLoading = !ons.ready || batchLoading

  return {
    normalisedName,
    valid,
    labelCount,
    ownerData,
    wrapperData,
    priceData,
    expiryDate,
    gracePeriodEndDate,
    isLoading,
    truncatedName,
    registrationStatus,
    isWrapped: ownerData?.ownershipLevel === 'nameWrapper',
    canBeWrapped:
      nameWrapperExists &&
      !isWrapped &&
      normalisedName?.endsWith('.op') &&
      !isLabelTooLong(normalisedName),
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
