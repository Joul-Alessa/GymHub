import { api } from './client.js';

export const getSports = () => api.get('/sports');
export const createSport = (name) => api.post('/sports', { name });
export const updateSport = (id, name) => api.put(`/sports/${id}`, { name });
