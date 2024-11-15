import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <img
            src="/path-to-your-logo.png"
            alt="App Logo"
            className="h-8 w-8"
          />
          <span className="text-xl font-semibold text-gray-800">YourAppName</span>
        </div>

        {/* Desktop Navigation Links and Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Navigation Links */}
          <nav className="flex space-x-4">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-blue-500 transition"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-sm text-gray-600 hover:text-blue-500 transition"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-gray-600 hover:text-blue-500 transition"
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-600 hover:text-blue-500 transition"
            >
              Contact
            </Link>
          </nav>

          {/* Authentication Buttons */}
          <div>
            {isAuthenticated ? (
              <Button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-500 text-white"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={() => loginWithRedirect()}
                className="bg-blue-500 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                /* Close icon */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                /* Menu icon */
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              className="block text-sm text-gray-600 hover:text-blue-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block text-sm text-gray-600 hover:text-blue-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block text-sm text-gray-600 hover:text-blue-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/contact"
              className="block text-sm text-gray-600 hover:text-blue-500 transition"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="mt-2">
              {isAuthenticated ? (
                <Button
                  onClick={() => {
                    logout({ returnTo: window.location.origin });
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    loginWithRedirect();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-blue-500 text-white"
                >
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;