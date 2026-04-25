import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'

import { AuthProvider } from './features/auth/context/AuthContext.jsx'
import { SettingsProvider } from './shared/context/SettingsContext.jsx'

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ backgroundColor: '#7f1d1d', color: 'white', padding: '40px', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 'bold' }}>Application Crashed!</h1>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '16px' }}>{this.state.error?.stack || this.state.error?.message}</pre>
          <p style={{ marginTop: '40px' }}>Please copy this text and share it with the AI agent.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
