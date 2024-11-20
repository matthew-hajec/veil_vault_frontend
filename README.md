# Cryptalyx

Supports client-side decryption and encryption of files using a password. This is achieved using the Web Crypto API and the AES-GCM encryption algorithm with the PBKDF2 key derivation function. (More details in the [ENC0](enc0.md) document.)

Future plans include adding support for uploading and downloading files via shared links. All data will be encrypted and decrypted client-side, ensuring that the server never has access to the unencrypted data. 

Who actually knows though, I'm not a cryptography expert.