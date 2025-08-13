// src/api/beds.js
import api from './axios';

export const getBeds = async () => {
  return await api.get('/beds');
};

export const getAvailableBeds = async () => {
  return await api.get('/beds/available');
};
