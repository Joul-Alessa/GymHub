import { api } from './client.js';

export const getMetrics = () => api.get('/metrics');
export const createMetric = (name) => api.post('/metrics', { name });
export const updateMetric = (id, name) => api.put(`/metrics/${id}`, { name });
export const createUnit = (metricId, name, abbreviation) =>
  api.post(`/metrics/${metricId}/units`, { name, abbreviation });
export const updateUnit = (id, name, abbreviation) => api.put(`/metrics/units/${id}`, { name, abbreviation });
