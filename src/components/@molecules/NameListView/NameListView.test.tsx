/* eslint-disable prettier/prettier */
import { mockFunction, render } from '@app/test-utils'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'

import { NameListView } from './NameListView'

jest.mock('@app/components/@atoms/NameDetailItem/TaggedNameItem')

const mockTaggedNameItem = mockFunction(TaggedNameItem)

const mockComponent = ({ name }: { name: string }) => <div key={name}>{name}</div>

describe('NameListView', () => {
  it('should render if there are results', () => {
    mockTaggedNameItem.mockImplementation(mockComponent as any)

    const { getByText } = render(
      <NameListView
        currentPage={
          [
            {
              name: 'name.op',
              id: '0x123',
              expiryDate: '2020-01-01',
              isController: true,
              isRegistrant: true,
            },
          ] as any
        }
        network={10}
      />,
    )
    expect(getByText('name.op')).toBeInTheDocument()
  })
  it('should render no results if there are no results', () => {
    const { queryByText } = render(<NameListView currentPage={[]} network={10} />)
    expect(queryByText('errors.noResults')).toBeInTheDocument()
  })
})
