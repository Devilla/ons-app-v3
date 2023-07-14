/* eslint-disable prettier/prettier */
import 'styled-components'

import { DefaultTheme as ThorinDefaultTheme } from '@opdomains/thorin'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends ThorinDefaultTheme {}
}
