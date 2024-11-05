import React, {useState} from 'react'
import { makeEnc0File } from '../crypto/enc0'

export default function FileEncryptor() {
    const [file, setFile] = useState(null)
    const [password, setPassword] = useState('')
    const [encryptedFileURL, setEncryptedFileURL] = useState(null)
    const [isEncrypting, setIsEncrypting] = useState(false)
    const [encryptionError, setEncryptionError] = useState('')

    const handleEncrypt = async () => {
        if(!file) {
            setEncryptionError('Please select a file to encrypt.')
            return
        }
        if(!password) {
            setEncryptionError('A password is required for encryption.')
        }

        setEncryptionError('')
        setIsEncrypting(true)
        setEncryptedFileURL(null)

        try {
            // Try to make an enc0 file
            const enc0File = await makeEnc0File(file, password)
            
            const url = URL.createObjectURL(enc0File)

            setEncryptedFileURL(url)
        } catch(error) {
            setEncryptionError(error.message || 'Encryption Failed')
        } finally {
            setIsEncrypting(false)
        }
    }

    return (
        <div className="bg-gray-100 flex flex-col items-center p-6 w-64 rounded-lg">
            <h1 className="text-4xl font-bold mb-8 text-grey-800">Encrypt File</h1>

            <div className="w-full mb-4">
                <label className='block text-gray-600 mb-2' htmlFor="file_upload">Select File</label>
                <input
                    className='w-full text-gray-700'
                    type="file"
                    onChange={e => setFile(e.target.files[0])}
                    name='file_upload'
                />
            </div>

            <div className='w-full mb-4'>
                <label className='block mb-2'>Password</label>
                <input 
                    className='w-full py-1'
                    placeholder='Encryption Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={e => handleEncrypt()}    
            >
                Encrypt
            </button>

            {encryptionError ? 
                <p className="text-red-600">{encryptionError}</p>
            : null}

            {encryptedFileURL ?
                <a 
                    className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4'
                    href={encryptedFileURL}
                >Download</a>
            : null}
        </div>
    )
}