import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const HomePage = () => {
  const { loginWithRedirect } = useAuth0();
  
  return (
    <div className="min-h-screen bg-gray-100">
        {/* Hero Section */}
        <section className="bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Securely Encrypt and Share Your Files
            </h1>
            <p className="text-gray-600 text-base mb-8">
                Control your data with client-side encryption and secure file sharing.
            </p>
            <div className="flex space-x-4">
                <Link to="/upload">
                <Button className="bg-blue-500 text-white px-6 py-3" onClick={loginWithRedirect}>
                    Get Started
                </Button>
                </Link>
                <a href="#features">
                <Button className="bg-gray-200 text-gray-800 px-6 py-3">
                    Learn More
                </Button>
                </a>
            </div>
            <img
                src="https://placehold.co/600x400"
                alt="Secure file sharing illustration"
                className="mt-12 w-full max-w-md"
            />
            </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="bg-white">
            <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
                Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Feature 1 */}
                <Card className="flex flex-col items-center text-center p-6">
                <img
                    src="https://placehold.co/100x100"
                    alt="Client-Side Encryption"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Client-Side Encryption
                </h3>
                <p className="text-gray-600 text-sm">
                    Your files are encrypted <strong>before</strong> they leave your device, ensuring only you and your intended recipients can access them.
                </p>
                </Card>
                {/* Feature 2 */}
                <Card className="flex flex-col items-center text-center p-6">
                <img
                    src="https://placehold.co/100x100"
                    alt="Secure Sharing"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Secure Sharing
                </h3>
                <p className="text-gray-600 text-sm">
                    Share files safely with a unique link and password—keep unauthorized users out.
                </p>
                </Card>
                {/* Feature 3 */}
                <Card className="flex flex-col items-center text-center p-6">
                <img
                    src="https://placehold.co/100x100"
                    alt="Open Source Security"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Open Source Security
                </h3>
                <p className="text-gray-600 text-sm">
                    Our encryption code is <strong>open source</strong>, allowing anyone to verify and trust our security measures.
                </p>
                </Card>
                {/* Feature 4 */}
                <Card className="flex flex-col items-center text-center p-6">
                <img
                    src="https://placehold.co/100x100"
                    alt="Simple and Intuitive"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Simple and Intuitive
                </h3>
                <p className="text-gray-600 text-sm">
                    Encrypt and share files in just a few clicks—no technical expertise required.
                </p>
                </Card>
            </div>
            </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-16">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
                How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <Card className="flex flex-col items-center text-center">
                <img
                    src="https://placehold.co/100x100"
                    alt="Encrypt Your File"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    1. Encrypt Your File
                </h3>
                <p className="text-gray-600 text-sm">
                    Select a file and set your encryption password. Your file is encrypted on your device using advanced encryption standards.
                </p>
                </Card>
                {/* Step 2 */}
                <Card className="flex flex-col items-center text-center">
                <img
                    src="https://placehold.co/100x100"
                    alt="Share Securely"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    2. Share Securely
                </h3>
                <p className="text-gray-600 text-sm">
                    Receive a unique link to share with your recipient. Share the password through a secure channel of your choice.
                </p>
                </Card>
                {/* Step 3 */}
                <Card className="flex flex-col items-center text-center">
                <img
                    src="https://placehold.co/100x100"
                    alt="Decrypt and Download"
                    className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    3. Decrypt and Download
                </h3>
                <p className="text-gray-600 text-sm">
                    Your recipient accesses the link and enters the password to decrypt and download the file—all within their browser.
                </p>
                </Card>
            </div>
            </div>
        </section>

        {/* Call-to-Action Banner */}
        <section className="bg-blue-500">
            <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
                Ready to Secure Your Files?
            </h2>
            <p className="text-blue-100 text-base mb-8">
                Experience simple and secure file sharing with Cryptalyx.
            </p>
            <Link to="/upload">
                <Button className="bg-white text-blue-500 px-6 py-3" onClick={loginWithRedirect}>
                Start Encrypting Now
                </Button>
            </Link>
            </div>
        </section>
    </div>
  );
};

export default HomePage;
