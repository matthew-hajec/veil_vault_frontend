import React, { useState } from 'react';
import { makeEnc0File, decryptEnc0File } from './crypto/enc0'; // Adjust the import path as necessary

function App() {
    // **Encryption States**
    const [fileToEncrypt, setFileToEncrypt] = useState(null);
    const [encryptionPassword, setEncryptionPassword] = useState('');
    const [encryptedFileURL, setEncryptedFileURL] = useState(null);
    const [encrypting, setEncrypting] = useState(false);
    const [encryptError, setEncryptError] = useState('');

    // **Decryption States**
    const [enc0File, setEnc0File] = useState(null);
    const [decryptionPassword, setDecryptionPassword] = useState('');
    const [decryptedFileURL, setDecryptedFileURL] = useState(null);
    const [decrypting, setDecrypting] = useState(false);
    const [decryptError, setDecryptError] = useState('');

    // **Handle Encryption**
    const handleEncrypt = async () => {
        // **Input Validation**
        if (!fileToEncrypt) {
            setEncryptError('Please select a file to encrypt.');
            return;
        }
        if (!encryptionPassword) {
            setEncryptError('Please enter a password for encryption.');
            return;
        }

        setEncryptError('');
        setEncrypting(true);
        setEncryptedFileURL(null); // Reset previous encrypted file

        try {
            // **Encrypt the File**
            const enc0Bytes = await makeEnc0File(fileToEncrypt, encryptionPassword);

            // **Create a Blob from Uint8Array**
            const enc0Blob = new Blob([enc0Bytes], { type: 'application/octet-stream' });

            // **Create a Downloadable URL**
            const url = URL.createObjectURL(enc0Blob);
            setEncryptedFileURL(url);
        } catch (error) {
            setEncryptError(error.message || 'Encryption failed.');
        } finally {
            setEncrypting(false);
        }
    };

    // **Handle Decryption**
    const handleDecrypt = async () => {
        // **Input Validation**
        if (!enc0File) {
            setDecryptError('Please select an ENC0 file to decrypt.');
            return;
        }
        if (!decryptionPassword) {
            setDecryptError('Please enter a password for decryption.');
            return;
        }

        setDecryptError('');
        setDecrypting(true);
        setDecryptedFileURL(null); // Reset previous decrypted file

        try {
            // **Decrypt the ENC0 File**
            const decryptedFile = await decryptEnc0File(enc0File, decryptionPassword);

            // **Create a Blob from the Decrypted File**
            const decryptedBlob = new Blob([decryptedFile], { type: enc0File.type });

            // **Create a Downloadable URL**
            const url = URL.createObjectURL(decryptedBlob);
            setDecryptedFileURL(url);
        } catch (error) {
            setDecryptError(error.message || 'Decryption failed.');
        } finally {
            setDecrypting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">ENC0 File Manager</h1>
            
            {/* **Encryption Section** */}
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Encrypt a File</h2>
                
                {/* **File Upload** */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Select File:</label>
                    <input
                        type="file"
                        onChange={(e) => setFileToEncrypt(e.target.files[0])}
                        className="w-full text-gray-700"
                    />
                </div>

                {/* **Password Input** */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Password:</label>
                    <input
                        type="password"
                        value={encryptionPassword}
                        onChange={(e) => setEncryptionPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter encryption password"
                    />
                </div>

                {/* **Error Message** */}
                {encryptError && <p className="text-red-500 mb-4">{encryptError}</p>}

                {/* **Encrypt Button** */}
                <button
                    onClick={handleEncrypt}
                    disabled={encrypting}
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                        encrypting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {encrypting ? 'Encrypting...' : 'Encrypt'}
                </button>

                {/* **Download Encrypted File** */}
                {encryptedFileURL && (
                    <div className="mt-4">
                        <a
                            href={encryptedFileURL}
                            download={`${fileToEncrypt.name}.enc0`}
                            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 inline-block"
                        >
                            Download Encrypted File
                        </a>
                    </div>
                )}
            </div>

            {/* **Decryption Section** */}
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Decrypt a File</h2>
                
                {/* **ENC0 File Upload** */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Select ENC0 File:</label>
                    <input
                        type="file"
                        accept=".enc0"
                        onChange={(e) => setEnc0File(e.target.files[0])}
                        className="w-full text-gray-700"
                    />
                </div>

                {/* **Password Input** */}
                <div className="mb-4">
                    <label className="block text-gray-600 mb-2">Password:</label>
                    <input
                        type="password"
                        value={decryptionPassword}
                        onChange={(e) => setDecryptionPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter decryption password"
                    />
                </div>

                {/* **Error Message** */}
                {decryptError && <p className="text-red-500 mb-4">{decryptError}</p>}

                {/* **Decrypt Button** */}
                <button
                    onClick={handleDecrypt}
                    disabled={decrypting}
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
                        decrypting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {decrypting ? 'Decrypting...' : 'Decrypt'}
                </button>

                {/* **Download Decrypted File** */}
                {decryptedFileURL && (
                    <div className="mt-4">
                        <a
                            href={decryptedFileURL}
                            download={enc0File.name.replace('.enc0', '')} // Remove .enc0 extension
                            className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 inline-block"
                        >
                            Download Decrypted File
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
