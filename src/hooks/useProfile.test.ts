/* eslint-disable prettier/prettier */
import { mockFunction, renderHook } from '@app/test-utils'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import { useOns } from '@app/utils/OnsProvider'

import { useProfile } from './useProfile'

jest.mock('@app/utils/OnsProvider')

const mockUseOns = mockFunction(useOns)
const mockGetProfile = jest.fn()

describe('useProfile', () => {
  mockUseOns.mockReturnValue({
    getProfile: mockGetProfile,
    ready: true,
  })

  it('should call getProfile with the name', async () => {
    const { waitForNextUpdate } = renderHook(() => useProfile('0x123'))
    await waitForNextUpdate()
    expect(mockGetProfile).toHaveBeenCalledWith('0x123', {
      fallback: {
        coinTypes: supportedAddresses,
        texts: [...supportedTexts, ...supportedProfileItems],
      },
    })
  })
})
