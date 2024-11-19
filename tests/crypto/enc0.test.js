import {expect, test, vi} from 'vitest'
import {numberToBytesBE, bytesToNumberBE, concatUint8Arrays, deriveKey, encryptBytes, decryptBytes} from '../../src/lib/crypto/enc0.js'
import { decryptEnc0File, makeEnc0File } from '../../src/lib/crypto/enc0.js'

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

    test('numberToBytesBE truncates the number to fit the byte length', () => {
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

// ====================
// encryptBytes
// these are integration tests, since they use the Web Crypto API, which can be affected by the environment
// ====================
{
    test('encryptBytes returns an object with the correct keys', async () => {
        const result = await encryptBytes(new Uint8Array(), 'password')
        expect(result).toHaveProperty('encryptedBytes')
        expect(result).toHaveProperty('iv')
        expect(result).toHaveProperty('salt')
    })

    test('encryptBytes returns an object with Uint8Array values', async () => {
        const result = await encryptBytes(new Uint8Array(), 'password')
        expect(result.encryptedBytes).toBeInstanceOf(Uint8Array)
        expect(result.iv).toBeInstanceOf(Uint8Array)
        expect(result.salt).toBeInstanceOf(Uint8Array)
    })

    test('encryptBytes returns a 12 byte initialization vector', async () => {
        const result = await encryptBytes(new Uint8Array(), 'password')
        expect(result.iv.length).toBe(12)
    })

    test('encryptBytes returns a 16 byte salt', async () => {
        const result = await encryptBytes(new Uint8Array(), 'password')
        expect(result.salt.length).toBe(16)
    })

    test('encryptBytes calls crypto.subtle.encrypt with the correct parameters', async () => {
        // Mock the global crypto.subtle.encrypt function
        const original = global.crypto.subtle.encrypt

        global.crypto.subtle.encrypt = vi.fn().mockResolvedValue(null)

        await encryptBytes(new Uint8Array(), 'password')

        expect(global.crypto.subtle.encrypt).toHaveBeenCalledWith(
            {
                name: "AES-GCM",
                iv: expect.anything()
            },
            expect.anything(),
            expect.anything()
        )

        // Restore the original function
        global.crypto.subtle.encrypt = original
    })
}

// ====================
// decryptBytes
// these are integration tests, since they use the Web Crypto API, which can be affected by the environment
// ====================
{
    test('decryptBytes returns a Uint8Array', async () => {
        // Mock the global crypto.subtle.decrypt function
        const original = global.crypto.subtle.decrypt

        global.crypto.subtle.decrypt = vi.fn().mockResolvedValue(new ArrayBuffer(50))

        const result = await decryptBytes(new Uint8Array(50), new Uint8Array(12), new Uint8Array(16), 'password')
        expect(result).toBeInstanceOf(Uint8Array)
    
        // Restore the original function
        global.crypto.subtle.decrypt = original
    })

    test('decryptBytes calls crypto.subtle.decrypt with the correct parameters', async () => {
        // Mock the global crypto.subtle.decrypt function
        const original = global.crypto.subtle.decrypt

        global.crypto.subtle.decrypt = vi.fn().mockResolvedValue(new ArrayBuffer(50))

        const iv = new Uint8Array(12)

        await decryptBytes(new Uint8Array(50), iv, new Uint8Array(16), 'password')

        expect(global.crypto.subtle.decrypt).toHaveBeenCalledWith(
            {
                name: "AES-GCM",
                iv: iv
            },
            expect.anything(),
            expect.anything()
        )

        // Restore the original function
        global.crypto.subtle.decrypt = original
    })
}

// ====================
// makeEnc0File
// these are integration tests, since they use the Web Crypto API, which can be affected by the environment
// ====================
{
    test('makeEnc0File returns a File', async () => {
        const file = new File([new Uint8Array(50)], 'file.enc0')

        const result = await makeEnc0File(file, 'password')
        expect(result).toBeInstanceOf(File)
    })

    test('makeEnc0File adds the magic bytes to the beginning of the file', async () => {
        const file = new File([new Uint8Array(50)], 'file.enc0')

        // Magic bytes are "ENC0" as ASCII
        const result = await makeEnc0File(file, 'password')

        const bytes = new Uint8Array(await result.arrayBuffer())

        expect(bytes.slice(0, 4)).toEqual(new Uint8Array([0x45, 0x4E, 0x43, 0x30]))
    })

    test('makeEnc0File adds the version number to the beginning of the file', async () => {
        const file = new File([new Uint8Array(50)], 'file.enc0')

        // Version number is 0x01
        const result = await makeEnc0File(file, 'password')

        const bytes = new Uint8Array(await result.arrayBuffer())

        expect(bytes[4]).toBe(1)
    })

    test('makeEnc0File encodes the IV and salt correctly', async () => {
        // Test by trying to decrypt the file
        const file = new File([new Uint8Array(50)], 'file.enc0')

        const encryptedFile = await makeEnc0File(file, 'password')

        const bytes = new Uint8Array(await encryptedFile.arrayBuffer())

        // Read the IV and salt from the file1
        const ivLength = bytesToNumberBE(bytes.slice(5, 7))
        const saltLength = bytesToNumberBE(bytes.slice(7, 9))

        const iv = bytes.slice(9, 9 + ivLength)
        const salt = bytes.slice(9 + ivLength, 9 + ivLength + saltLength)

        // Decryption should not throw an error
        await decryptBytes(bytes.slice(9 + ivLength + saltLength), iv, salt, 'password')
    })
}

// ====================
// Unassociated tests
// ====================
{
    // Integration test, can be affected by the environment
    test('encrypts and decrypts a message', async () => {
        const message = new Uint8Array([0x12, 0x34, 0x56, 0x78])
        const password = 'password'

        const {encryptedBytes, iv, salt} = await encryptBytes(message, password)
        const decryptedBytes = await decryptBytes(encryptedBytes, iv, salt, password)

        expect(decryptedBytes).toEqual(message)
    })

    test('creates and decrypts an enc0 file with the same bytes', async () => {
        const inputFile = new File([new Uint8Array([0x12, 0x34, 0x56, 0x78])], 'file.txt')

        const encryptedFile = await makeEnc0File(inputFile, 'password')

        const decryptedFile = await decryptEnc0File(encryptedFile, 'password')

        // The bytes should be the same
        const decryptedBytes = new Uint8Array(await decryptedFile.arrayBuffer())

        expect(decryptedBytes).toEqual(new Uint8Array([0x12, 0x34, 0x56, 0x78]))
     })

    test('creates and decrypts an enc0 file with the same name', async () => {
        const inputFile = new File([new Uint8Array([0x12, 0x34, 0x56, 0x78])], 'file.txt')

        const encryptedFile = await makeEnc0File(inputFile, 'password')

        const decryptedFile = await decryptEnc0File(encryptedFile, 'password')

        // The name should be the same
        expect(decryptedFile.name).toBe('file.txt')
    })
}