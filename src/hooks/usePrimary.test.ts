/* eslint-disable prettier/prettier */
import { mockFunction, renderHook } from '@app/test-utils'

import { useOns } from '@app/utils/OnsProvider'

import { usePrimary } from './usePrimary'

jest.mock('@app/utils/OnsProvider')

const mockUseOns = mockFunction(useOns)

const mockGetName = jest.fn()

describe('usePrimary', () => {
  mockUseOns.mockReturnValue({
    ready: true,
    getName: mockGetName,
  })
  it('should return a name if name is returned and matches', async () => {
    mockGetName.mockResolvedValue({
      name: 'test.op',
      match: true,
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrimary('0x123'))
    await waitForNextUpdate()
    expect(result.current.name).toBe('test.op')
  })
  it("should return null if name doesn't match", async () => {
    mockGetName.mockResolvedValue({
      name: 'test.op',
      match: false,
    })

    const { result, waitForNextUpdate } = renderHook(() => usePrimary('0x123'))
    await waitForNextUpdate()
    expect(result.current.name).toBe(null)
  })
})
