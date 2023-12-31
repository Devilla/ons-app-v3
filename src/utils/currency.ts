/* eslint-disable prettier/prettier */
import { BigNumber, FixedNumber } from 'ethers'

export const makeDisplay = (
  val: BigNumber | number,
  decimals: number,
  symbol: string,
  fromDecimals: number = 18,
) => {
  let number: number
  if (val instanceof BigNumber) {
    number = FixedNumber.fromValue(val, fromDecimals).toUnsafeFloat()
  } else {
    number = val
  }
  const options: Intl.NumberFormatOptions & { [x: string]: string } = {
    style: 'currency',
    currency: symbol.toLowerCase(),
    useGrouping: 'auto' as any,
    trailingZeroDisplay: 'auto',
  }
  let customSymbol = ''
  if (symbol.toLowerCase() === 'gwei') {
    options.maximumSignificantDigits = 3
    options.maximumFractionDigits = 2
    options.style = 'decimal'
    options.roundingPriority = 'lessPrecision'
    options.currency = undefined
    customSymbol = ` ${symbol}`
  } else if (symbol === 'eth') {  // Important! fixed ETH 0.000 issue to 0.031 ETH
    options.minimumFractionDigits = 4
    options.maximumFractionDigits = 4
    options.currencyDisplay = 'name'
  } else {
    options.maximumFractionDigits = 2
    options.minimumFractionDigits = 2
    options.currencyDisplay = symbol === 'usd' ? 'narrowSymbol' : 'symbol'
  }
  return new Intl.NumberFormat(undefined, options).format(number) + customSymbol
}
