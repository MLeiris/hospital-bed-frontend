import api from './axios';

export const createWard = (wardData) => api.post('/admin/wards', wardData);
export const getWardStats = () => api.get('/wards/stats');
export const getUsers = () => api.get('/admin/users');
