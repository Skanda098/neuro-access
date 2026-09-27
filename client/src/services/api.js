import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const fetchProfile = () => API.get('/profile');
export const updateProfileAPI = (profileData) => API.put('/profile', profileData);
export const processUrlAPI = (url) => API.post('/adapter/process', { url });