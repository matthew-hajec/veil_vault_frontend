import React, { useState } from 'react'
import Button from '../common/Button'
import { decryptEnc0File } from '../../crypto/enc0'

export default function DecryptionWidget({ file }) {
    const [password, setPassword] = useState('')
    const [fileURL, setFileURL] = useState(null)
    const [unencryptedFile, setUnencryptedFile] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isDecrypting, setIsDecrypting] = useState(false)

    const handleDecrypt = async () => {
        setErrorMessage('')
        setFileURL(null)
        setUnencryptedFile(null)
        
        if (!file) {
            setErrorMessage('No file selected for decryption.')
            return
        }
        if (!password) {
            setErrorMessage('Password required to decrypt.')
            return
        }

        setIsDecrypting(true)
        
        try {
            const decryptedFile = await decryptEnc0File(file, password)
            const url = URL.createObjectURL(decryptedFile)
            setFileURL(url)
            setUnencryptedFile(decryptedFile)
        } catch (error) {
            setErrorMessage(error.message || 'Decryption Failed.')
        } finally {
            setIsDecrypting(false)
        }
    }

    const downloadFile = () => {
        if(!fileURL || !unencryptedFile) {
            // Should never happen because the button should not be visible unless there is a file
            setErrorMessage('The file is not available, refresh and try again.')
            return
        }
        
        // Create an a tag with the
        const a = document.createElement('a')
        a.href = fileURL
        a.download = unencryptedFile.name
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.click()
    }

    return (
        <div className="max-w-md mx-auto p-2 bg-white rounded-sm shadow border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Decrypt File</h2>

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-2 px-2 py-1 border border-gray-300 rounded-sm text-sm text-gray-800 focus:outline-none focus:border-blue-400"
            />

            {errorMessage && (
                <p className="text-xs text-red-500 mb-2">{errorMessage}</p>
            )}

            <Button
                onClick={handleDecrypt}
                isLoading={isDecrypting}
                className={'w-full bg-blue-500 text-white'}>
                Decrypt
            </Button>

            {fileURL && (
                <Button
                    onClick={downloadFile}
                    className='w-full mt-2 bg-green-500 text-white'
                >
                    Download
                </Button>
            )}
        </div>
    )
}
