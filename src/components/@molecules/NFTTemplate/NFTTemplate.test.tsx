/* eslint-disable prettier/prettier */
import { cleanup, render, waitFor } from '@app/test-utils'

import NFTTemplate from './NFTTemplate'

describe('NFTTemplate', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should render', async () => {
    const { getByText } = render(
      <NFTTemplate name="nick.op" backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('nick.op')).toBeInTheDocument()
  })

  it('should render with background', async () => {
    const whiteBG =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQYV2P4DwABAQEAWk1v8QAAAABJRU5ErkJggg=='
    const { getByText, getByTestId } = render(
      <NFTTemplate name="validator.op" backgroundImage={whiteBG} isNormalised />,
    )
    expect(getByText('validator.op')).toBeInTheDocument()
    expect(getByTestId('nft-back-img')).toBeInTheDocument()
  })

  it('should render with subdomain', async () => {
    const { getByText } = render(
      <NFTTemplate name="itsasubdomain.khori.op" backgroundImage={undefined} isNormalised />,
    )
    expect(getByText('itsasubdomain.')).toBeInTheDocument()
  })

  it('should render domain with more than 25 chars', async () => {
    const { getByText } = render(
      <NFTTemplate
        name="thisnameislongerthan25char.op"
        backgroundImage={undefined}
        isNormalised
      />,
    )
    expect(getByText('thisnameislonge')).toBeInTheDocument()
    expect(getByText('rthan25char.op')).toBeInTheDocument()
  })

  it('should use polyfill of Intl.Segmenter if browser does not support', async () => {
    ;(window.Intl.Segmenter as typeof Intl['Segmenter']) = undefined as any
    const { getByText } = render(
      <NFTTemplate name="alisha.op" backgroundImage={undefined} isNormalised />,
    )
    await waitFor(() => expect(getByText('alisha.op')).toBeInTheDocument())
    expect(getByText('alisha.op')).toBeInTheDocument()
  })
})
