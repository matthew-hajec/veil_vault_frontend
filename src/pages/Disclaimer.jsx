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
          This project is a demonstration of my software development skills and is not intended
          for real-world use. By using this application:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>No guarantees are made regarding functionality, security, or data protection.</li>
          <li>Any data provided is used solely at your own risk.</li>
          <li>This project is for portfolio purposes only and does not represent a real product or service.</li>
        </ul>
        <p className="text-gray-700 mb-6">
          By clicking "Accept," you acknowledge and agree to these terms.
        </p>
        <div className="flex justify-center">
          <Button className="bg-blue-500 text-white px-6 py-3" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DisclaimerPage;
