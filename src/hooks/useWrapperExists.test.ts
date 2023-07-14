/* eslint-disable prettier/prettier */
import { mockFunction, renderHook } from '@app/test-utils'

import { useOns } from '@app/utils/OnsProvider'

import { useChainId } from './useChainId'
import { useWrapperExists } from './useWrapperExists'

jest.mock('@app/utils/OnsProvider')
jest.mock('./useChainId')

const mockUseOns = mockFunction(useOns)
const mockUseChainId = mockFunction(useChainId)

const mockGetContractAddress = jest.fn()

describe('useWrapperExists', () => {
  mockUseChainId.mockReturnValue(1)
  mockGetContractAddress.mockReturnValue(() => '0x123')
  it('should return false if ONS not ready', () => {
    mockUseOns.mockReturnValue({
      ready: false,
      getContractAddress: mockGetContractAddress,
    })
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(false)
  })
  it('should return false if nameWrapper address is undefined', () => {
    mockUseOns.mockReturnValue({
      ready: true,
      getContractAddress: mockGetContractAddress,
    })
    mockGetContractAddress.mockReturnValue(() => undefined)
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(false)
  })
  it('should return false if nameWrapper address is empty address', () => {
    mockUseOns.mockReturnValue({
      ready: true,
      getContractAddress: mockGetContractAddress,
    })
    mockGetContractAddress.mockReturnValue(() => '0x0000000000000000000000000000000000000000')
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(false)
  })
  it('should return true if nameWrapper address is not empty address', () => {
    mockUseOns.mockReturnValue({
      ready: true,
      getContractAddress: mockGetContractAddress,
    })
    mockGetContractAddress.mockReturnValue(() => '0x123')
    const { result } = renderHook(() => useWrapperExists())
    expect(result.current).toBe(true)
  })
})
