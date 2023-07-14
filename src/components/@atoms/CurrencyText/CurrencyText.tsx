/* eslint-disable prettier/prettier */
import { BigNumber } from 'ethers'

import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: BigNumber  // currency
  currency: CurrencyDisplay
}

export const CurrencyText = ({ eth, currency = 'eth' }: Props) => {   // currency
  const { data: ethPrice, loading } = useEthPrice()

  if (loading || !eth || !ethPrice) return null  // currency

  if (currency === 'eth') {
    return <>{makeDisplay(eth, 5, 'eth')}</>  // currency
  }
  return <>{makeDisplay(eth.mul(ethPrice).div(1e8), 2, currency, 18)}</>  // currency
}
