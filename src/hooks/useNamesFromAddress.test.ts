/* eslint-disable prettier/prettier */
import { mockFunction, renderHook } from '@app/test-utils'

import { useOns } from '@app/utils/OnsProvider'

import { useNamesFromAddress } from './useNamesFromAddress'

jest.mock('@app/utils/OnsProvider')

const mockUseOns = mockFunction(useOns)

const mockGetNames = jest.fn()

const makeNameItem = (isSubname: boolean) => (_: any, index: number) => {
  const base = {
    id: index,
    labelName: String(index),
    truncatedName: String(index),
    labelhash: '0x123',
    isMigrated: true,
    name: `${index}.op`,
    parent: {
      name: 'op',
    },
    type: 'domain',
  }
  if (isSubname) {
    return {
      ...base,
      createdAt: new Date(Date.now() - 60 * 60 * 24 * 1000 * index),
    }
  }
  return {
    ...base,
    registrationDate: new Date(Date.now() - 60 * 60 * 24 * 1000 * index),
    expiryDate: new Date(Date.now() + 60 * 60 * 24 * 1000 * index),
  }
}

describe('useNamesFromAddress', () => {
  mockUseOns.mockReturnValue({
    ready: true,
    getNames: mockGetNames,
  })
  it('should return the correct amount of result per page', async () => {
    const names = Array.from({ length: 10 }, makeNameItem(false))

    mockGetNames.mockResolvedValue(names)

    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.currentPage).toHaveLength(5)
    expect(result.current.pageLength).toBe(2)
  })
  describe('should correctly sort names', () => {
    it('should sort by creation date', async () => {
      const names = [
        ...Array.from({ length: 10 }, makeNameItem(false)),
        ...Array.from({ length: 10 }, makeNameItem(true)),
      ]

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'asc',
            type: 'creationDate',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.currentPage![0]
      const last = result.current.currentPage![4]
      expect(first.registrationDate?.getDate()).toBe(
        new Date(Date.now() - 60 * 60 * 24 * 1000 * 9).getDate(),
      )
      expect(last.registrationDate?.getDate()).toBe(
        new Date(Date.now() - 60 * 60 * 24 * 1000 * 5).getDate(),
      )
    })
    it('should sort by expiry date', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false))

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'expiryDate',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.currentPage![0]
      const last = result.current.currentPage![4]
      expect(first.expiryDate?.getDate()).toBe(
        new Date(Date.now() + 60 * 60 * 24 * 1000 * 9).getDate(),
      )
      expect(last.expiryDate?.getDate()).toBe(
        new Date(Date.now() + 60 * 60 * 24 * 1000 * 5).getDate(),
      )
    })
    it('should sort by label name', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false))

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'labelName',
          },
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      const first = result.current.currentPage![0]
      const last = result.current.currentPage![4]
      expect(first.labelName).toBe('9')
      expect(last.labelName).toBe('5')
    })
  })
  describe('should correctly filter names', () => {
    it('should filter by registration', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false))
      names[0].type = 'registration'

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'expiryDate',
          },
          filter: 'registration',
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      expect(result.current.currentPage).toHaveLength(1)
    })
    it('should filter by domain', async () => {
      const names = Array.from({ length: 10 }, makeNameItem(false)).map((name) => ({
        ...name,
        type: 'registration',
      }))
      names[0].type = 'domain'

      mockGetNames.mockResolvedValue(names)

      const { result, waitForNextUpdate } = renderHook(() =>
        useNamesFromAddress({
          page: 1,
          resultsPerPage: 5,
          sort: {
            orderDirection: 'desc',
            type: 'expiryDate',
          },
          filter: 'domain',
          address: '0x123',
        }),
      )
      await waitForNextUpdate()
      expect(result.current.currentPage).toHaveLength(1)
    })
  })
  it('should return the correct page length', async () => {
    const names = Array.from({ length: 25 }, makeNameItem(false))

    mockGetNames.mockResolvedValue(names)

    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.pageLength).toBe(5)
  })
  it('should correctly merge data', async () => {
    const names = [
      ...Array.from({ length: 10 }, makeNameItem(false)),
      ...Array.from({ length: 10 }, makeNameItem(false)).map((name) => ({
        ...name,
        type: 'registration',
      })),
    ]

    mockGetNames.mockResolvedValue(names)

    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.nameCount).toBe(10)
    expect(result.current.currentPage![0].isRegistrant).toBe(true)
    expect(result.current.currentPage![0].isController).toBe(true)
  })
  it('should use registration expiry for wrapped domains', async () => {
    const names = [
      {
        ...makeNameItem(true)(null, 0),
        type: 'wrappedDomain',
        expiryDate: new Date(0),
        registration: {
          registrationDate: new Date(Date.now() - 60 * 60 * 24 * 1000 * 6),
          expiryDate: new Date(Date.now() + 60 * 60 * 24 * 1000 * 6),
        },
      },
    ]

    mockGetNames.mockResolvedValue(names)
    const { result, waitForNextUpdate } = renderHook(() =>
      useNamesFromAddress({
        page: 1,
        resultsPerPage: 5,
        sort: {
          orderDirection: 'desc',
          type: 'expiryDate',
        },
        address: '0x123',
      }),
    )
    await waitForNextUpdate()
    expect(result.current.currentPage![0].expiryDate!.getTime()).toBe(
      names[0].registration.expiryDate.getTime(),
    )
  })
})
