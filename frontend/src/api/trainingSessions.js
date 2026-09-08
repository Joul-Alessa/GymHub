import { api } from './client.js';

export const getSessions = (from, to) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  return api.get(`/training-sessions${qs ? `?${qs}` : ''}`);
};
export const getSession = (id) => api.get(`/training-sessions/${id}`);
export const createSession = (sessionDate, notes) => api.post('/training-sessions', { sessionDate, notes });
export const deleteSession = (id) => api.del(`/training-sessions/${id}`);
export const addEntry = (sessionId, payload) => api.post(`/training-sessions/${sessionId}/entries`, payload);
export const updateEntry = (sessionId, entryId, payload) =>
  api.put(`/training-sessions/${sessionId}/entries/${entryId}`, payload);
export const deleteEntry = (sessionId, entryId) => api.del(`/training-sessions/${sessionId}/entries/${entryId}`);
