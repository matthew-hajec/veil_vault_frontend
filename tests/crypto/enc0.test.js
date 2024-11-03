import {expect, test} from 'vitest'
import {numberToBytesBE, bytesToNumberBE} from './src/crypto/enc0.js'

// ====================
// numberToBytesBE
// ====================
test('numberToBytesBE returns a Uint8Array', () => {
    const result = numberToBytesBE(0, 2)
    expect(result).toBeInstanceOf(Uint8Array)
})

test('numberToBytesBE returns the correct number of bytes', () => {
    const result = numberToBytesBE(0, 25)
    expect(result.length).toBe(25)
})

test('numberToBytesBE returns the correct bytes for a positive number', () => {
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

// ====================
// bytesToNumberBE
// ====================
test('bytesToNumberBE returns a number', () => {
    const result = bytesToNumberBE(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0x12, 0x34]))
    expect(typeof result).toBe('number');
})

test('bytesToNumberBE returns the correct number for a byte array', () => {
    const result = bytesToNumberBE(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0x12, 0x34]))
    expect(result).toBe(0x1234)
})

test('bytesToNumberBE returns 0 for an empty byte array', () => {
    const result = bytesToNumberBE(new Uint8Array())
    expect(result).toBe(0)
})

test('bytesToNumberBE returns 0 for a byte array of all zeros', () => {
    const result = bytesToNumberBE(new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]))
    expect(result).toBe(0)
})

test('bytesToNumberBE returns the correct number for a byte array with a single byte', () => {
    const result = bytesToNumberBE(new Uint8Array([0x12]))
    expect(result).toBe(0x12)
})