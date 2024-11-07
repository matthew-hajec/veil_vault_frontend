import React, { useState } from 'react'
import Button from '../Button'
import { makeEnc0File } from '../../crypto/enc0'

export default function EncryptionWidget({file}) {
    const [password, setPassword] = useState('')
    const [fileURL, setFileURL] = useState(null)
    const [encryptedFile, setEncryptedFile] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isEncrypting, setIsEncrypting] = useState(false)

    const handleEncrypt = async () => {
        setErrorMessage('')
        setFileURL(null)
        setEncryptedFile(null)

        if (!file) {
            setErrorMessage('No file selected for encryption.')
            return
        }
        if (!password) {
            setErrorMessage('Password required to encrypt.')
            return
        }

        setIsEncrypting(true)

        try {
            const encryptedFile = await makeEnc0File(file, password)
            const url = URL.createObjectURL(encryptedFile)
            setFileURL(url)
            setEncryptedFile(encryptedFile)
        } catch (error) {
            setErrorMessage(error.message || 'Encryption failed.')
        } finally {
            setIsEncrypting(false)
        }
    }

    const downloadFile = () => {
        if(!fileURL || !encryptedFile) {
            setErrorMessage('The file is not available. refresh and try again.')
            return
        }

        // Create an a tag with the
        const a = document.createElement('a')
        a.href = fileURL
        a.download = encryptedFile.name
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.click()
    }

    return (
        <div className="max-w-md mx-auto p-2 bg-white rounded-sm shadow border border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Encrypt File</h2>

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
            onClick={handleEncrypt}
            isLoading={isEncrypting}
            className={'w-full bg-blue-500 text-white'}
        >
            Encrypt
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