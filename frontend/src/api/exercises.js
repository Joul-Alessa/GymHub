import { api } from './client.js';

export const getExercises = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.sportId) params.set('sportId', filters.sportId);
  if (filters.subclassificationId) params.set('subclassificationId', filters.subclassificationId);
  const qs = params.toString();
  return api.get(`/exercises${qs ? `?${qs}` : ''}`);
};
export const getExercise = (id) => api.get(`/exercises/${id}`);
export const createExercise = (payload) => api.post('/exercises', payload);
export const updateExercise = (id, payload) => api.put(`/exercises/${id}`, payload);
export const deleteExercise = (id) => api.del(`/exercises/${id}`);
export const uploadExercisePhoto = (id, file) => {
  const form = new FormData();
  form.append('photo', file);
  return api.post(`/exercises/${id}/photos`, form);
};
export const deleteExercisePhoto = (id, photoId) => api.del(`/exercises/${id}/photos/${photoId}`);
export const getExerciseHistory = (id, limit) => api.get(`/exercises/${id}/history${limit ? `?limit=${limit}` : ''}`);
export const getExerciseProgress = (id, metricId) => api.get(`/exercises/${id}/progress?metricId=${metricId}`);
