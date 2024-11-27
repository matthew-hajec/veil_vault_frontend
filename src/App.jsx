import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from './pages/Home';
import UploadPage from './pages/Upload';
import DownloadPage from './pages/Download';
import DashboardPage from './pages/Dashboard';
import DisclaimerPage from './pages/Disclaimer';
import Header from './components/layout/Header';

const App = () => {
  const { isLoading } = useAuth0();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  useEffect(() => {
    const disclaimerAccepted = localStorage.getItem('disclaimerAccepted') === 'true';
    setDisclaimerAccepted(disclaimerAccepted);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Disclaimer route */}
        {!disclaimerAccepted && <Route path="*" element={<DisclaimerPage setDisclaimerAccepted={setDisclaimerAccepted}/>} />}
        {disclaimerAccepted && (
          <>
            {/* Home route */}
            <Route path="/" element={<HomePage />} />
            {/* Upload route */}
            <Route path="/upload" element={<UploadPage />} />
            {/* Download route */}
            <Route path="/download/:id" element={<DownloadPage />} />
            {/* Dashboard route */}
            <Route path="/dashboard" element={<DashboardPage />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
