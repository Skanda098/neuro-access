import React, { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext';
import './SettingsPanel.css';

export const SettingsPanel = () => {
  const { profile, updateProfile } = useContext(ProfileContext);

  return (
    <aside className="settings-panel">
      <h2>Accessibility Settings</h2>

      <div className="setting-group">
        <label>Contrast Theme</label>
        <div className="theme-buttons">
          {['standard', 'dark', 'high-contrast', 'sepia'].map((mode) => (
            <button
              key={mode}
              className={`theme-btn ${profile.contrastMode === mode ? 'active' : ''}`}
              onClick={() => updateProfile({ contrastMode: mode })}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-group">
        <label>Font Size: {profile.fontSize}px</label>
        <input
          type="range"
          min="14"
          max="32"
          value={profile.fontSize}
          onChange={(e) => updateProfile({ fontSize: Number(e.target.value) })}
        />
      </div>

      <div className="setting-group">
        <label>Line Spacing: {profile.lineSpacing}</label>
        <input
          type="range"
          min="1.2"
          max="2.5"
          step="0.1"
          value={profile.lineSpacing}
          onChange={(e) => updateProfile({ lineSpacing: Number(e.target.value) })}
        />
      </div>

      <div className="setting-group">
        <label>Font Family</label>
        <select
          value={profile.fontFamily}
          onChange={(e) => updateProfile({ fontFamily: e.target.value })}
        >
          <option value="sans-serif">System Sans-Serif</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Courier New', monospace">Monospace</option>
          <option value="Georgia, serif">Georgia</option>
        </select>
      </div>

      <div className="setting-group">
        <label>Speech Rate: {profile.speechRate}x</label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={profile.speechRate}
          onChange={(e) => updateProfile({ speechRate: Number(e.target.value) })}
        />
      </div>
    </aside>
  );
};