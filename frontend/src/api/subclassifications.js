import { api } from './client.js';

export const getSubclassifications = (sportId) =>
  api.get(sportId ? `/subclassifications?sportId=${sportId}` : '/subclassifications');
export const createSubclassification = (sportId, name) => api.post('/subclassifications', { sportId, name });
export const updateSubclassification = (id, name) => api.put(`/subclassifications/${id}`, { name });
