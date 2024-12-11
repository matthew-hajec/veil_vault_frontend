import React from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const DisclaimerPage = ({ setDisclaimerAccepted }) => {
  const handleAccept = () => {
    // Set a cookie or localStorage item to remember the user's acceptance
    localStorage.setItem('disclaimerAccepted', 'true');
    setDisclaimerAccepted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Card className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Disclaimer
        </h1>
        <p className="text-gray-700 mb-6">
          This project is a demonstration of my software development skills and
          is not intended for real-world use. By using this application, you
          agree to these terms:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>
            <strong>No Guarantees:</strong> The service provides no guarantees
            regarding functionality, security, data protection, or uptime.
          </li>
          <li>
            <strong>Use at Your Own Risk:</strong> Any data uploaded, encrypted,
            or shared using this application is done so at your own risk. I am
            not responsible for any data loss, breaches, or unauthorized access.
          </li>
          <li>
            <strong>Not a Real Product:</strong> This project is for portfolio
            and demonstrative purposes only and does not represent a real
            product or service.
          </li>
          <li>
            <strong>No Liability:</strong> I am not liable for any damages,
            including but not limited to direct, indirect, incidental, or
            consequential damages arising from the use or inability to use this
            application.
          </li>
        </ul>
        <p className="text-gray-700 mb-6">
          By clicking "Accept," you acknowledge that you have read, understood,
          and agree to be bound by these terms.
        </p>
        <div className="flex justify-center">
          <Button
            className="bg-blue-500 text-white px-6 py-3"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DisclaimerPage;
