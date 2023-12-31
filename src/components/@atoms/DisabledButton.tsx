/* eslint-disable prettier/prettier */
import styled, { css } from 'styled-components'

import { Button } from '@opdomains/thorin'

export const DisabledButton = styled(Button)(
  () => css`
    filter: grayscale(100%);
    opacity: 0.5;
    pointer-events: none;
  `,
)
