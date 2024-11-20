import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Card from '../components/common/Card';
import { getDashboardInfo } from '../lib/api/api';

const DashboardPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to format bytes to MB
  const formatBytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2);
  };

  // Fetch dashboard information on component mount
  useEffect(() => {
    const fetchDashboardInfo = async () => {
      try {
        const token = await getAccessTokenSilently();
        const data = await getDashboardInfo(token);
        setDashboardInfo(data);
      } catch (err) {
        setError(
          err.message ||
            'An error occurred while fetching dashboard information.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardInfo();
  }, []);

  if (!isAuthenticated) {
    // Redirect to home page if user is not authenticated
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          {/* You can add additional header elements here if needed */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Loading State */}
        {loading && (
          <div
            className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              Loading dashboard information...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Dashboard Information */}
        {dashboardInfo && (
          <div className="space-y-6">
            {/* User Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                User Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">Max File Size:</p>
                  <p className="text-gray-800 font-medium">
                    {formatBytesToMB(dashboardInfo.user.maxFileSizeBytes)} MB
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Max Uploads/Month:</p>
                  <p className="text-gray-800 font-medium">
                    {dashboardInfo.user.maxUploadsPerMonth}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">File Retention Period:</p>
                  <p className="text-gray-800 font-medium">
                    {dashboardInfo.user.fileRetentionPeriodDays} Days
                  </p>
                </div>
              </div>
            </Card>

            {/* Files List */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Your Files
              </h2>
              {dashboardInfo.files.length === 0 ? (
                <p className="text-gray-600">You have no uploaded files.</p>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Upload Date
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          Download
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardInfo.files
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .map((file) => (
                          <tr key={file.blobID}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-800">
                              {new Date(file.createdAt).toLocaleDateString()}{' '}
                              {new Date(file.createdAt).toLocaleTimeString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-500">
                              <a
                                href={`/download/${file.blobID}`}
                                className="hover:underline"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
