import {expect, test, vi} from 'vitest'
import {numberToBytesBE, bytesToNumberBE, concatUint8Arrays, deriveKey} from './src/crypto/enc0.js'

// ====================
// numberToBytesBE
// ====================
{
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
}

// ====================
// bytesToNumberBE
// ====================
{
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
}

// ====================
// concatUint8Arrays
// ====================
{    
    test('concatUint8Arrays returns a Uint8Array', () => {
        const result = concatUint8Arrays(new Uint8Array(), new Uint8Array())
        expect(result).toBeInstanceOf(Uint8Array)
    })

    test('concatUint8Arrays returns the correct number of bytes', () => {
        const result = concatUint8Arrays(new Uint8Array(10), new Uint8Array(15))
        expect(result.length).toBe(25)
    })

    test('concatUint8Arrays returns the correct bytes', () => {
        const result = concatUint8Arrays(new Uint8Array([0x12, 0x34]), new Uint8Array([0x56, 0x78]))
        expect(result).toEqual(new Uint8Array([0x12, 0x34, 0x56, 0x78]))
    })

    test('concatUint8Arrays concatenates 10 arrays', () => {
        // create 10 uint8 arrays with the index as the value
        const arrays = Array.from({length: 10}, (_, i) => new Uint8Array([i]))

        const result = concatUint8Arrays(...arrays)
        expect(result).toEqual(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))
    })

    test('concatUint8Arrays returns the correct bytes when passed a single array', () => {
        const result = concatUint8Arrays(new Uint8Array([0x12, 0x34]))
        expect(result).toEqual(new Uint8Array([0x12, 0x34]))
    })

    test('concatUint8Arrays returns the correct bytes when passed no value', () => {
        const result = concatUint8Arrays()
        expect(result).toEqual(new Uint8Array())
    })

    test('concatUint8Arrays returns the correct bytes when passed zeroed arrays', () => {
        const result = concatUint8Arrays(new Uint8Array([0, 0]), new Uint8Array([0, 0, 0]))
        expect(result).toEqual(new Uint8Array([0, 0, 0, 0, 0]))
    })
}

// ====================
// deriveKey
// these are integration tests, since they use the Web Crypto API, which can be affected by the environment
// expect them to run much slower than the other tests, and they may fail for environmental reasons (such as low entropy)
// ====================
{
    test('deriveKey returns a CryptoKey', async () => {
        const result = await deriveKey('password', new Uint8Array(16))
        expect(result).toBeInstanceOf(CryptoKey)
    })

    test('deriveKey returns a key that can be used for encryption and decryption', async () => {
        const key = await deriveKey('password', new Uint8Array(16))
        // check the properties of the key, should have encrypt and decrypt
        expect(key.usages).toEqual(['encrypt', 'decrypt'])
    })

    test('deriveKey returns a key that uses AES-GCM', async () => {
        const key = await deriveKey('password', new Uint8Array(16))
        expect(key.algorithm.name).toBe('AES-GCM')
    })

    test('deriveKey returns a 256-bit key', async () => {
        const key = await deriveKey('password', new Uint8Array(16))
        expect(key.algorithm.length).toBe(256)
    })

    test('derikeKey returns an extractable key', async () => {
        const key = await deriveKey('password', new Uint8Array(16))
        expect(key.extractable).toBe(true)
    })

    test('deriveKey returns a key which uses PBKDF2 with SHA-256 hash and 650,000 iterations', async () => {
        // Mock the global crypto.subtle.deriveKey function
        const original = global.crypto.subtle.deriveKey
        
        global.crypto.subtle.deriveKey = vi.fn().mockResolvedValue(null)

        await deriveKey('password', new Uint8Array(16))

        expect(global.crypto.subtle.deriveKey).toHaveBeenCalledWith(
            {
                name: "PBKDF2",
                salt: new Uint8Array(16),
                iterations: 650_000,
                hash: "SHA-256"
            },
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything()
        )

        // Restore the original function
        global.crypto.subtle.deriveKey = original
    });
}