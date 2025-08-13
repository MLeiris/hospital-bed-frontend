// src/api/patients.js
import api from './axios';

export const registerPatient = async (patientData) => {
  return await api.post('/receptionist/patients', patientData);
};

export const dischargePatient = async (patientId) => {
  return await api.put(`/receptionist/patients/${patientId}/discharge`);
};

export const getPatients = async () => {
  return await api.get('/doctor/patients');
};

export const searchPatients = async (name) => {
  return await api.get('/receptionist/patients/search', { params: { name } });
};

export const getPatientHistory = async (name, startDate, endDate) => {
  return await api.get('/patients/history', {
    params: { name, start_date: startDate, end_date: endDate }
  });
};
