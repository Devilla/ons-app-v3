/* eslint-disable prettier/prettier */
import { render, screen, waitFor } from '@app/test-utils'

import userEvent from '@testing-library/user-event'

import { CurrencySwitch } from './CurrencySwitch'

const mockChangeHandler = jest.fn()

const getSwitchSate = () => {
  return getComputedStyle(screen.getByTestId('currency-switch')).left === '50%' ? 'USD' : 'ETH'  // currency
}

describe('CurrencySwitch', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders correctly', async () => {
    render(<CurrencySwitch value="eth" onChange={mockChangeHandler} />) // currency
    expect(screen.getByText('ETH')).toBeVisible()  // currency
    expect(screen.getByText('USD')).toBeVisible()
    await waitFor(() => {
      expect(getSwitchSate()).toBe('ETH')  // currency
    })
  })

  it('should be set to value of value', async () => {
    render(<CurrencySwitch onChange={mockChangeHandler} value="fiat" />)
    await waitFor(() => {
      expect(getSwitchSate()).toBe('USD')
    })
  })

  it('should call onChange when clicked', async () => {
    render(<CurrencySwitch onChange={mockChangeHandler} value="fiat" />)
    await userEvent.click(screen.getByTestId('currency-eth'))
    await waitFor(() => {
      expect(mockChangeHandler).toBeCalledWith('eth')  // currency
    })
  })
})
