/* eslint-disable prettier/prettier */
import { mockFunction, renderHook, waitFor } from '@app/test-utils'

import { useOns } from '@app/utils/OnsProvider'

import { useBasicName } from './useBasicName'
import { useValidate } from './useValidate'
import { useWrapperExists } from './useWrapperExists'

jest.mock('@app/utils/OnsProvider')
jest.mock('./useValidate')
jest.mock('./useWrapperExists')

const mockUseOns = mockFunction(useOns)
const mockUseValidate = mockFunction(useValidate)
const mockUseWrapperExists = mockFunction(useWrapperExists)

const mockGetOwner = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetExpiry = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetPrice = {
  ...jest.fn(),
  batch: jest.fn(),
}
const mockGetWrapperData = {
  ...jest.fn(),
  batch: jest.fn(),
}

const mockBatch = jest.fn()

describe('useBasicName', () => {
  mockUseOns.mockReturnValue({
    ready: true,
    getOwner: mockGetOwner,
    getExpiry: mockGetExpiry,
    getPrice: mockGetPrice,
    getWrapperData: mockGetWrapperData,
    batch: mockBatch,
  })
  mockUseWrapperExists.mockReturnValue(true)
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should query for the expiry if the name is a 2LD .op', async () => {
    mockUseValidate.mockReturnValue({
      valid: true,
      name: 'test.op',
      labelCount: 2,
    })

    renderHook(() => useBasicName('test.op'))
    await waitFor(() => expect(mockBatch).toHaveBeenCalled())
    expect(mockGetExpiry.batch).toHaveBeenCalled()
  })
  it('should not query for the expiry if not a 2LD .op', () => {
    mockUseValidate.mockReturnValue({
      valid: true,
      name: 'test.com',
      labelCount: 2,
    })

    renderHook(() => useBasicName('test.com'))
    expect(mockGetExpiry.batch).not.toHaveBeenCalled()
  })
})
