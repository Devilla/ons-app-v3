/* eslint-disable prettier/prettier */
import styled, { css } from 'styled-components'

import { Button } from '@opdomains/thorin'

import { useCopied } from '@app/hooks/useCopied'

import { IconCopyAnimated } from './IconCopyAnimated'

const Container = styled.div(
  () => css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

export const CopyButton = ({ value }: { value: string }) => {
  const { copy, copied } = useCopied()

  return (
    <Container>
      <Button onClick={() => copy(value)} size="extraSmall" variant="transparent" shadowless>
        <IconCopyAnimated copied={copied} size="3.5" />
      </Button>
    </Container>
  )
}
