/* eslint-disable prettier/prettier */
import 'styled-components'

import { lightTheme } from '@opdomains/thorin'

type Theme = typeof lightTheme

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
