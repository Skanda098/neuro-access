import React, { createContext, useState, useEffect } from 'react';
import { fetchProfile, updateProfileAPI } from '../services/api';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    fontSize: 18,
    fontFamily: 'sans-serif',
    lineSpacing: 1.6,
    contrastMode: 'standard',
    speechRate: 1.0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.contrastMode);
    document.documentElement.style.setProperty('--user-font-size', `${profile.fontSize}px`);
    document.documentElement.style.setProperty('--user-line-spacing', profile.lineSpacing);
    document.documentElement.style.setProperty('--user-font-family', profile.fontFamily);
  }, [profile]);

  const loadProfile = async () => {
    try {
      const res = await fetchProfile();
      if (res.data) setProfile(res.data);
    } catch (err) {
      console.error('Failed to load accessibility profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newSettings) => {
    setProfile((prev) => ({ ...prev, ...newSettings }));
    try {
      await updateProfileAPI(newSettings);
    } catch (err) {
      console.error('Failed to sync profile with database:', err);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};