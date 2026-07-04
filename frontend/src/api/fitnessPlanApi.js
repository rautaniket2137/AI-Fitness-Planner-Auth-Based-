import axiosInstance from './axiosInstance';

export const generateFitnessPlan = (profileData) =>
  axiosInstance.post('/fitness-plans', profileData);

export const regenerateFitnessPlan = (planId) =>
  axiosInstance.post(`/fitness-plans/${planId}/regenerate`);

export const getMyFitnessPlans = (page = 1, limit = 10) =>
  axiosInstance.get(`/fitness-plans?page=${page}&limit=${limit}`);

export const getFitnessPlanById = (planId) =>
  axiosInstance.get(`/fitness-plans/${planId}`);

export const deleteFitnessPlan = (planId) =>
  axiosInstance.delete(`/fitness-plans/${planId}`);

export const addProgressLog = (planId, data) =>
  axiosInstance.post(`/fitness-plans/${planId}/progress`, data);
