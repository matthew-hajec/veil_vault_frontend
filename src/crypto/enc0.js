// Note: See `enc0.md` for the file format specification
// In this file, Uint8Array is used for all byte arrays

// Convert a number to a uint8 byte array in big-endian order
// Truncates the number to fit the byte length
// Returns bytes for zero instead of negative numbers
export function numberToBytesBE(number, byteLength) {
    if (number < 0) {
        // Return bytes for zero instead of negative numbers
        return new Uint8Array(byteLength).fill(0);
    }

    const bytes = [];
    for (let i = 0; i < byteLength; i++) {
        // Push the least significant byte first
        const lsb = number & 0xff;
        bytes.unshift(lsb);
        number = number >> 8;
    }
    return new Uint8Array(bytes);
}

// Convert a uint8 byte array to a number in big-endian order
export function bytesToNumberBE(bytes) {
    let number = 0;
    for (let i = 0; i < bytes.length; i++) {
        // Shift the number up by one byte and add the next byte
        number = (number << 8) + bytes[i];
    }
    return number;
}

export function concatUint8Arrays(...arrays) {
    const totalLength = arrays.reduce((acc, array) => acc + array.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    arrays.forEach((array) => {
        result.set(array, offset);
        offset += array.length;
    });
    return result;
}

export async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 650_000,
            hash: "SHA-256"
        },
        passwordKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

// Encrypts a Uint8Array with a password, returning the encrypted bytes, IV, and salt
export async function encryptBytes(bytes, password) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for IV
    const salt = crypto.getRandomValues(new Uint8Array(16)); // 16 bytes for salt
    const key = await deriveKey(password, salt);
    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        bytes
    );
    const encryptedBytes = new Uint8Array(encryptedBuffer);
    return { encryptedBytes, iv, salt };
}

// Decrypts a Uint8Array with a password, returning the decrypted bytes
export async function decryptBytes(encryptedBytes, iv, salt, password) {
    const key = await deriveKey(password, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedBytes
    );
    return new Uint8Array(decryptedBuffer);
}

function byteArraysEqual(a, b) {
    return a.every((byte, index) => byte === b[index]);
}

function readOffset(file, offset, length) {
    return new Uint8Array(file.slice(offset, offset + length));
}

// Constructs the bytes of an enc0 file
export async function makeEnc0File(file, password) {
    // Get the bytes of the file
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    // Encode the filename
    const filenameBytes = new TextEncoder().encode(file.name);

    // 2-byte filename length
    const filenameLengthBytes = numberToBytesBE(filenameBytes.length, 2);

    // Combine and encrypt the bytes of the `Encrypted Data` field
    const combinedBytes = concatUint8Arrays(
        filenameLengthBytes,
        filenameBytes,
        fileBytes,
    );
    const { encryptedBytes, iv, salt } = await encryptBytes(combinedBytes, password);
    
    // 4-byte magic number and 1-byte version number
    const magicNumber = new Uint8Array([0x45, 0x4e, 0x43, 0x30]); // "ENC0"
    const versionNumber = new Uint8Array([0x01]);

    // iv and salt lengths
    const ivLength = numberToBytesBE(iv.length, 2); // 2 bytes for IV length
    const saltLength = numberToBytesBE(salt.length, 2); // 2 bytes for salt length

    // Combine all the bytes
    return concatUint8Arrays(
        magicNumber,
        versionNumber,
        ivLength,
        saltLength,
        iv,
        salt,
        encryptedBytes
    );
}

// Decrypts an enc0 file with a password, returning the decrypted file
export async function decryptEnc0File(file, password) {
    // Get the bytes of the file
    const fileBytes = new Uint8Array(await file.arrayBuffer());

    // Initialize the offset
    let offset = 0;

    // The first 4 bytes are the magic number, and should be ASCII "ENC0"
    const expectedMagic = new Uint8Array([0x45, 0x4e, 0x43, 0x30]); // "ENC0"
    const magicNumber = fileBytes.slice(offset, offset + 4);
    if (!byteArraysEqual(magicNumber, expectedMagic)) {    
        throw new Error("Not an enc0 file");
    }
    offset += 4;

    // The next byte is the version number, which should be 0x01
    const versionNumber = bytesToNumberBE(fileBytes.slice(offset, offset + 1));
    if (versionNumber !== 1) {
        throw new Error("Unsupported version number");
    }
    offset += 1;  

    // Get the IV and salt lengths, 2 bytes each
    const ivLength = bytesToNumberBE(fileBytes.slice(offset, offset + 2));
    offset += 2;
    const saltLength = bytesToNumberBE(fileBytes.slice(offset, offset + 2));
    offset += 2;
    
    // Get the IV and salt, using the lengths from above
    const iv = fileBytes.slice(offset, offset + ivLength);
    offset += ivLength;
    const salt = fileBytes.slice(offset, offset + saltLength);
    offset += saltLength;

    // Get the encrypted bytes, which are the rest of the file
    const encryptedBytes = fileBytes.slice(offset);

    // Decrypt the bytes
    const decryptedBytes = await decryptBytes(encryptedBytes, iv, salt, password);

    // Reset the offset for the decrypted bytes of the encrypted data
    offset = 0;

    // Get the filename length, 2 bytes
    const filenameLength = bytesToNumberBE(decryptedBytes.slice(0, 2));
    offset += 2;

    // Get the filename, using the length from above
    const filename = new TextDecoder().decode(decryptedBytes.slice(offset, offset + filenameLength));
    offset += filenameLength;

    // Get the payload bytes, which are the rest of the decrypted bytes
    const payloadBytes = decryptedBytes.slice(offset);
    
    // Return the file
    return new File([payloadBytes], filename);
}