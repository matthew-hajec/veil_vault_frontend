import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col
                    items-center justify-center text-center px-4">
      {/* Title and subtitle for 404 */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 text-base mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>

      {/* CTA Button: routes user back to the homepage */}
      <Link to="/">
        <Button className="bg-blue-500 text-white px-6 py-3">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
