import React, { useState } from 'react';
import Button from '../common/Button';
import { uploadFile } from '../../lib/api/api';
import { useAuth0 } from '@auth0/auth0-react';
import { makeEnc0File } from '../../lib/crypto/enc0';

const EncryptionWidget = ({ file, onUpload }) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('No file selected, please choose a file to upload.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password to encrypt the file.');
      return;
    }

    setLoading(true);

    try {
      const token = await getAccessTokenSilently({
        audience: 'https://api.veilvault.com',
        scope: 'upload:file',
      });
      const encryptedFile = await makeEnc0File(file, password);
      const data = await uploadFile(encryptedFile, token);
      onUpload(data.id);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('File upload failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-width">
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
        isLoading={loading}
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white"
      >
        Upload File
      </Button>
    </div>
  );
};

export default EncryptionWidget;
