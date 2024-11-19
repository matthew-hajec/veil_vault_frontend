import React, { useState } from 'react'
import Button from '../common/Button'
import { downloadFile } from '../../lib/api/api'
import { useAuth0 } from '@auth0/auth0-react'

const DecryptionWidget = ({ id }) => {
    const [password, setPassword] = useState('')
    const [unencryptedFile, setUnencryptedFile] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        if (!password) {
            setErrorMessage('Password required to decrypt.')
            return
        }

        setLoading(true)

        try {
            const file = await downloadFile(id, password)
            setUnencryptedFile(file)
            setErrorMessage('')
        } catch (error) {
            setErrorMessage('File download failed: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const clientDownloadFile = () => {
        if(!unencryptedFile) {
            // Should never happen because the button should not be visible unless there is a file
            setErrorMessage('The file is not available, refresh and try again.')
            return
        }

        const fileURL = URL.createObjectURL(unencryptedFile)
        
        // Create an a tag with the
        const a = document.createElement('a')
        a.href = fileURL
        a.download = unencryptedFile.name
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        a.click()
    }

    return (
        <div className="max-w">
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
                onClick={handleDownload}
                isLoading={loading}
                className={'w-full bg-blue-500 text-white'}>
                Download and Decrypt
            </Button>

            {unencryptedFile && (
                <Button
                    onClick={clientDownloadFile}
                    className='w-full mt-2 bg-green-500 text-white'
                >
                    Download
                </Button>
            )}
        </div>
    )
}

export default DecryptionWidget