import {expect, test} from 'vitest'
import {numberToBytesBE} from './src/crypto/enc0.js'

test('numberToBytesBE returns a Uint8Array', () => {
    const result = numberToBytesBE(0, 2)
    expect(result).toBeInstanceOf(Uint8Array)
})

test('numberToBytesBE returns the big-endian bytes for a number', () => {
    const result = numberToBytesBE(0x1234, 10)
    expect(result).toEqual(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0x12, 0x34]))
})

test('numberToBytesBE returns the correct bytes for 0', () => {
    const result = numberToBytesBE(0, 2)
    expect(result).toEqual(new Uint8Array([0, 0]))
})

test('numberToBytesBE returns the bytes for 0 when passed a negative number', () => {
    const result = numberToBytesBE(-100, 2)
    expect(result).toEqual(new Uint8Array([0, 0]))
})

test('numbertToBytesBE truncates the number to fit the byte length', () => {
    const result = numberToBytesBE(0x123456, 2)
    expect(result).toEqual(new Uint8Array([0x34, 0x56]))
})

