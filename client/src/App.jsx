import React, { useState } from 'react';
import { SettingsPanel } from './components/SettingsPanel';
import { ReaderView } from './components/ReaderView';
import { AudioPlayer } from './components/AudioPlayer';
import { processUrlAPI } from './services/api';
import './App.css';

export default function App() {
  const [url, setUrl] = useState('');
  const [adaptedData, setAdaptedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    try {
      const res = await processUrlAPI(url);
      setAdaptedData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to adapt target URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>NeuroAccess</h1>
        <p>Cognitive & Vision-Accessible Content Adapter</p>
      </header>

      <form className="url-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Paste web article URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adapting...' : 'Adapt Content'}
        </button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      <div className="main-layout">
        <SettingsPanel />
        <main className="content-area">
          {adaptedData && <AudioPlayer content={adaptedData} />}
          {adaptedData ? (
            <ReaderView data={adaptedData} />
          ) : (
            <div className="placeholder-card">
              Enter a web page URL above to view an accessible, simplified, and clutter-free version.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}