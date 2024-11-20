import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Auth0Provider } from '@auth0/auth0-react'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="auth.cryptalyx.com"
      clientId='UqMSfQzORr4q9RDgQO62MvXfhcjXJNim'
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: 'https://api.veilvault.com',
        scope: 'upload:file openid profile email',
      }}>
    <App />
    </Auth0Provider>
  </StrictMode>,
)
