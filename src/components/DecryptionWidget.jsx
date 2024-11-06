import React, { useState } from 'react'
import { decryptEnc0File } from '../crypto/enc0'

export default function DecryptionWidget({ file }) {
    const [password, setPassword] = useState('')
    const [fileURL, setFileURL] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isDecrypting, setIsDecrypting] = useState(false)

    const handleDecrypt = async () => {        
        if (!file) {
            setErrorMessage('No file selected')
            return
        }
        if (!password) {
            setErrorMessage('Please provide a password')
            return
        }

        setErrorMessage('')
        setIsDecrypting(true)
        setFileURL(null)

        try {
            const decryptedFile = await decryptEnc0File(file, password)
            const url = URL.createObjectURL(decryptedFile)
            setFileURL(url)
        } catch (error) {
            setErrorMessage(error.message || 'Decryption Failed')
        } finally {
            setIsDecrypting(false)
        }
    }

    return (
        <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Decrypt File</h2>

            <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-gray-700 focus:outline-none focus:border-blue-500"
            />

            {errorMessage && (
                <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
            )}

            <button
                onClick={handleDecrypt}
                disabled={isDecrypting}
                className={`w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                            transition-opacity duration-200 ${isDecrypting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
                {isDecrypting ? (
                    <span className="relative flex items-center">
                        <span className="absolute w-full h-1 bg-blue-300 animate-pulse"></span>
                        Decrypting...
                    </span>
                ) : (
                    'Decrypt'
                )}
            </button>

            {fileURL && (
                <a
                    href={fileURL}
                    download="decrypted_file"
                    className="w-full mt-4 inline-block text-center py-2 bg-green-600 text-white rounded-lg 
                               transition-colors duration-200 hover:bg-green-700"
                >
                    Download File
                </a>
            )}
        </div>
    )
}
