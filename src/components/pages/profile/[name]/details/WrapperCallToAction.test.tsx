/* eslint-disable prettier/prettier */
import { mockFunction, render, screen } from '@app/test-utils'

import { ReactNode } from 'react'
import { useAccount } from 'wagmi'

import { useNFTImage } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import useWrapperApprovedForAll from '@app/hooks/useWrapperApprovedForAll'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { useOns } from '@app/utils/OnsProvider'

import { WrapperCallToAction } from './WrapperCallToAction'

jest.mock('@app/hooks/useAvatar')
jest.mock('@app/transaction-flow/TransactionFlowProvider')
jest.mock('@app/utils/OnsProvider')
jest.mock('@app/hooks/useChainId')
jest.mock('wagmi')
jest.mock('@app/hooks/useNameDetails')
jest.mock('@app/hooks/useWrapperApprovedForAll')
jest.mock('@app/assets/NightSky', () => ({
  NightSky: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

const mockUseNFTImage = mockFunction(useNFTImage)
const mockUseTransaction = mockFunction(useTransactionFlow)
const mockUseOns = mockFunction(useOns)
const mockUseChainId = mockFunction(useChainId)
const mockUseAccount = mockFunction(useAccount)
const mockUseNameDetails = mockFunction(useNameDetails)
const mockUseWrapperApprovedForAll = mockFunction(useWrapperApprovedForAll)

const mockWrapName = {
  populateTransaction: jest.fn(),
}
const mockSetRecords = {
  populateTransaction: jest.fn(),
}
const mockGetProfile = jest.fn()
const mockContracts = {
  getPublicResolver: jest.fn(),
}

const mockCreateTransactionFlow = jest.fn()
const mockResumeTransactionFlow = jest.fn()
const mockGetResumeable = jest.fn()

describe('WrapperCallToAction', () => {
  mockUseNFTImage.mockReturnValue({ isCompatible: true, image: '#' })
  mockUseTransaction.mockReturnValue({
    resumeTransactionFlow: mockResumeTransactionFlow,
    createTransactionFlow: mockCreateTransactionFlow,
    getResumable: mockGetResumeable,
  })
  mockUseOns.mockReturnValue({
    ready: true,
    wrapName: mockWrapName,
    setRecords: mockSetRecords,
    getProfile: mockGetProfile,
    contracts: mockContracts,
  })
  mockUseChainId.mockReturnValue(1)
  mockUseAccount.mockReturnValue({ address: '0x123' })
  mockUseNameDetails.mockReturnValue({
    ownerData: { owner: '0x123' },
    profile: { resolverAddress: '0x456' },
    isLoading: false,
  })
  mockUseWrapperApprovedForAll.mockReturnValue({
    approvedForAll: true,
    isLoading: false,
  })

  it('should render', () => {
    mockResumeTransactionFlow.mockReturnValue(0)
    render(<WrapperCallToAction name="test123.op" />)
    expect(screen.getByTestId('wrapper-cta-container')).toBeVisible()
    expect(screen.getByTestId('wrapper-cta-button')).toHaveTextContent('details.wrap.startLabel')
  })
  it('should set the current transaction on click', () => {
    render(<WrapperCallToAction name="test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    expect(mockCreateTransactionFlow).toHaveBeenCalled()
  })
  it('should create a transaction flow for migrateProfile and wrapName', async () => {
    mockContracts.getPublicResolver.mockResolvedValue({ address: '0x123' })
    mockUseNameDetails.mockReturnValue({
      ownerData: { owner: '0x123' },
      profile: {
        resolverAddress: '0x456',
        records: {
          coinTypes: [
            {
              key: 'coin1',
            },
            {
              key: 'coin2',
            },
          ],
        },
      },
      isLoading: false,
    })
    render(<WrapperCallToAction name="test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-test123.op')
    expect(args[1].transactions[0].name).toEqual('migrateProfile')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.op' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'test123.op' })
  })

  it('should create a transaction flow for a .op 2LD with no profile', () => {
    mockUseNameDetails.mockReturnValue({
      ownerData: { owner: '0x123' },
      profile: {
        resolverAddress: '0x456',
        records: {},
      },
      isLoading: false,
    })
    render(<WrapperCallToAction name="test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-test123.op')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.op' })
  })
  it('should create a transaction flow for a .op 2LD with a profile and a different owner', () => {
    mockUseNameDetails.mockReturnValue({
      ownerData: { owner: '0x124' },
      profile: {
        resolverAddress: '0x456',
        records: {
          coinTypes: [
            {
              key: 'coin1',
            },
            {
              key: 'coin2',
            },
          ],
        },
      },
      isLoading: false,
    })
    render(<WrapperCallToAction name="test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-test123.op')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'test123.op' })
    expect(args[1].transactions[1].name).toEqual('migrateProfile')
    expect(args[1].transactions[1].data).toEqual({ name: 'test123.op', resolverAddress: '0x456' })
  })

  it('should create a transaction flow for a subname with no registry approval', () => {
    mockUseNameDetails.mockReturnValue({
      ownerData: { owner: '0x123' },
      profile: {
        resolverAddress: '0x456',
        records: {},
      },
      isLoading: false,
    })
    mockUseWrapperApprovedForAll.mockReturnValue({
      approvedForAll: false,
      isLoading: false,
    })
    render(<WrapperCallToAction name="sub.test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-sub.test123.op')
    expect(args[1].transactions[0].name).toEqual('approveNameWrapper')
    expect(args[1].transactions[0].data).toEqual({ address: '0x123' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'sub.test123.op' })
  })
  it('should create a transaction flow for a subname with existing registry approval', () => {
    mockUseNameDetails.mockReturnValue({
      ownerData: { owner: '0x123' },
      profile: {
        resolverAddress: '0x456',
        records: {},
      },
      isLoading: false,
    })
    mockUseWrapperApprovedForAll.mockReturnValue({
      approvedForAll: true,
      isLoading: false,
    })
    render(<WrapperCallToAction name="sub.test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-sub.test123.op')
    expect(args[1].transactions[0].name).toEqual('wrapName')
    expect(args[1].transactions[0].data).toEqual({ name: 'sub.test123.op' })
  })
  it('should create a transaction flow for a subname with a profile', () => {
    mockUseNameDetails.mockReturnValue({
      ownerData: { owner: '0x123' },
      profile: {
        resolverAddress: '0x456',
        records: {
          coinTypes: [
            {
              key: 'coin1',
            },
            {
              key: 'coin2',
            },
          ],
        },
      },
      isLoading: false,
    })
    render(<WrapperCallToAction name="sub.test123.op" />)
    screen.getByTestId('wrapper-cta-button').click()
    const args = mockCreateTransactionFlow.mock.lastCall

    expect(args[0]).toBe('wrapName-sub.test123.op')
    expect(args[1].transactions[0].name).toEqual('migrateProfile')
    expect(args[1].transactions[0].data).toEqual({ name: 'sub.test123.op' })
    expect(args[1].transactions[1].name).toEqual('wrapName')
    expect(args[1].transactions[1].data).toEqual({ name: 'sub.test123.op' })
  })

  it('should show button as resumable if step is greater than 0', () => {
    mockGetResumeable.mockReturnValue(1)
    render(<WrapperCallToAction name="test123.op" />)
    expect(screen.getByTestId('wrapper-cta-button')).toHaveTextContent('details.wrap.resumeLabel')
  })
})
