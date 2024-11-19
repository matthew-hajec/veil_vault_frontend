import { useState, useEffect } from 'react';
import DecryptionWidget from '../components/widgets/Decryption';
import Card from '../components/common/Card';
import { useParams } from 'react-router-dom';
import { fetchFileSize } from '../lib/api/api';
import { useAuth0 } from '@auth0/auth0-react';

const DownloadPage = () => {
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: 'https://api.veilvault.com',
          scope: 'download:file'
        });
        await fetchFileSize(id, token);
      } catch (error) {
        if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An error occurred. Try again later.');
        }
      }
    })()
  }, [id]);
    

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Content */}
      <main className="pt-4 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
        <section className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Secure File Download</h1>
          <p className="text-gray-600 text-sm">
            Decrypt and download your files securely. Your data privacy is our top priority.
          </p>
        </section>

        {/* DecryptionWidget Component */}
        {
          errorMessage ? (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          ) : (
            <Card className="mb-6">
              <DecryptionWidget id={id} />
            </Card>
          )
        }

        {/* How It Works Section */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h2>
          <p className="text-gray-600 text-sm mb-4">
            To access your file, please enter the password used during encryption. Without the correct password, the file cannot be decrypted.
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>
              Enter the password provided by the sender to decrypt the file.
            </li>
            <li>
              Click <strong>"Download and Decrypt"</strong> to securely retrieve your file.
            </li>
            <li>
              After decryption, click <strong>"Download"</strong> to save the file to your device.
            </li>
            <li>
              We do not store your password or decrypted files on our servers, ensuring your data remains private.
            </li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default DownloadPage;
