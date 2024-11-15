import React, { useState } from 'react';
import EncryptionWidget from '../components/widgets/Encryption';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const { isAuthenticated } = useAuth0();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/" />;
  }

  const onUpload = async (id) => {
    // Redirect to the download page with the file ID
    navigate(`/download/${id}`);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Content */}
      <main className="pt-4 px-4 md:px-8 lg:px-12 max-w-3xl mx-auto">
        <section className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Secure File Upload</h1>
          <p className="text-gray-600 text-sm">
            Encrypt and upload your files securely. Your data privacy is our top priority.
          </p>
        </section>

        {/* File Upload Input */}
        <section className="my-4">
          <input
            type="file"
            onChange={e => setSelectedFile(e.target.files[0])}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
          />
        </section>

        {/* EncryptionWidget Component */}
        <section className="my-8 p-4 bg-white rounded-sm shadow-md border border-gray-200">
          {/* Pass the selected file to EncryptionWidget */}
          <EncryptionWidget file={selectedFile} onUpload={onUpload}/>
        </section>

        {/* How It Works Section */}
        <section className="my-8 p-4 bg-white rounded-sm shadow-md border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">How It Works</h2>
          <p className="text-gray-600 text-sm mb-4">
            When you upload a file, it is encrypted using the password you provide. After uploading, 
            you will receive a unique link that you can share with others. However, the link alone 
            isn't sufficient; the recipient must also know the password to decrypt and access the file.
          </p>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
            <li>
              Ensure you share the password securely, such as through an encrypted messenger or 
              in person.
            </li>
            <li>
              If the password is compromised, any security or confidentiality guarantees are void. 
              Use a strong, unique password to maximize security.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default UploadPage;
