import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import HomePage from './pages/Home';
import UploadPage from './pages/Upload';
import DownloadPage from './pages/Download';
import DashboardPage from './pages/Dashboard';
import Header from './components/layout/Header';

const App = () => {
    const { isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/download/:id" element={<DownloadPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
    )
}

export default App;