# ENC0 File Format Specification

## Introduction

The ENC0 file format is designed for securely storing encrypted files along with their metadata. This document provides a concise specification of the ENC0 format.

## File Structure Overview

An ENC0 file consists of a header followed by the encrypted data. The structure is as follows:

```
[Magic Number][Version][IV Length][Salt Length][IV][Salt][Encrypted Data]
```

- **Magic Number**: 4 bytes
- **Version**: 1 byte
- **IV Length**: 2 bytes
- **Salt Length**: 2 bytes
- **IV**: Variable length
- **Salt**: Variable length
- **Encrypted Data**: Variable length

### Detailed Field Descriptions

#### 1. Magic Number (4 bytes)

A constant value used to identify the file format. For ENC0 files, the magic number is the ASCII string `ENC0`.

- **Hexadecimal Representation**: `0x45 0x4E 0x43 0x30`
- **Purpose**: Validates that the file is in the ENC0 format.

#### 2. Version (1 byte)

Indicates the version of the ENC0 file format.

- **Current Version**: `0x01`
- **Purpose**: Allows for backward compatibility and future extensions.

#### 3. IV Length (2 bytes)

Specifies the length of the Initialization Vector (IV) in bytes.

- **Format**: Unsigned integer in **big-endian** order.
- **Purpose**: Informs how many bytes to read for the IV.

#### 4. Salt Length (2 bytes)

Specifies the length of the salt used for key derivation.

- **Format**: Unsigned integer in **big-endian** order.
- **Purpose**: Informs how many bytes to read for the salt.

#### 5. IV (Variable Length)

The Initialization Vector used in the encryption algorithm.

- **Length**: As specified by **IV Length**.
- **Purpose**: Ensures uniqueness and randomness in encryption.

#### 6. Salt (Variable Length)

The salt used in the key derivation function.

- **Length**: As specified by **Salt Length**.
- **Purpose**: Enhances security by adding randomness to the key derivation process.

#### 7. Encrypted Data (Variable Length)

Contains the encrypted file data and metadata.

- **Contents**: One or more encrypted files.
- **Encryption**: The entire data is encrypted using AES-GCM.

## Encrypted Data Structure

Each file within the **Encrypted Data** section follows this structure:

```
[Filename Length][Filename][File Data]
```

### Field Descriptions

#### 1. Filename Length (2 bytes)

Specifies the length of the filename in bytes.

- **Format**: Unsigned integer in **big-endian** order.
- **Purpose**: Indicates how many bytes to read for the filename.

#### 2. Filename (Variable Length)

The name of the file.

- **Encoding**: UTF-8
- **Length**: As specified by **Filename Length**.
- **Purpose**: Allows the original filename to be restored upon decryption.

#### 3. File Data (Variable Length)

The actual content of the file.

- **Length**: Until the end of this file's data or the start of the next file (if multiple files are supported).
- **Purpose**: Contains the data that was originally in the file before encryption.

## Data Encoding and Formats

- **Numeric Fields**: All multi-byte numeric fields (**IV Length**, **Salt Length**, **Filename Length**) are stored in **big-endian** byte order.
- **String Fields**: Filenames are encoded using **UTF-8** to support a wide range of characters.

## Encryption Details

- **Algorithm**: AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Derivation**: PBKDF2 (Password-Based Key Derivation Function 2) with HMAC-SHA256
  - **Parameters**: 650,000 iterations, 256-bit key length
- **Initialization Vector (IV)**: Randomly generated for each encryption
- **Salt**: Randomly generated for each encryption

## Example

### Header Example

```
Magic Number: 0x45 0x4E 0x43 0x30   // 'ENC0'
Version: 0x01
IV Length: 0x00 0x0C               // 12 bytes (big-endian)
Salt Length: 0x00 0x10             // 16 bytes (big-endian)
IV: [12 bytes]
Salt: [16 bytes]
Encrypted Data: [variable length]
```

### Encrypted Data Example

Assuming a filename length of 9 bytes for "document":

```
Filename Length: 0x00 0x09   // 9 bytes (big-endian)
Filename: 0x64 0x6F 0x63 0x75 0x6D 0x65 0x6E 0x74          // 'document' in UTF-8
File Data: [variable length]
```

## Security Considerations

- **IV Uniqueness**: Ensure the IV is unique for each encryption to prevent replay attacks.
- **Salt Randomness**: Use a cryptographically secure random number generator for the salt.
- **Password Strength**: Encourage users to use strong, unique passwords to enhance security.

## Extensibility

- **Versioning**: The **Version** field allows for future updates to the format.
