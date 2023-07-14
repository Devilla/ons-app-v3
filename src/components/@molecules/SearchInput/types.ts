/* eslint-disable prettier/prettier */
export type SearchItemType = 'text' | 'error' | 'address' | 'name'

export type SearchItem = {
  type: SearchItemType | 'nameWithDotOp'
  value?: string
}

export type HistoryItem = {
  type: 'name' | 'address'
  value: string
}

export type AnyItem = (SearchItem | HistoryItem) & {
  isHistory: boolean
}
