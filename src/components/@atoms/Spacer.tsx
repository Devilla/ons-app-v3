/* eslint-disable prettier/prettier */
import styled, { css } from 'styled-components'

import { Space } from '@opdomains/thorin'

export const Spacer = styled.div<{ $height: Space }>(
  ({ theme, $height }) => css`
    width: 100%;
    height: ${theme.space[$height]};
  `,
)
