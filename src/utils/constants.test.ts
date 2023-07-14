/* eslint-disable prettier/prettier */
import { RESOLVER_ADDRESSES } from './constants'

describe('RESOLVER_ADDRESSES', () => {
  it('should have the most recent resolver as the first address', () => {
    expect(RESOLVER_ADDRESSES['10'][0]).toEqual('0xC546cAb96752765cD2A4f5898eCB31bF370FAB84')
    expect(RESOLVER_ADDRESSES['1337'][0]).toEqual('0x70e0bA845a1A0F2DA3359C97E0285013525FFC49')
    expect(RESOLVER_ADDRESSES['420'][0]).toEqual('0x061dFb0DB0Ec6dbB10F078C06268cdA430d491F9')
  })
})
