import { api } from './client.js';

export const getHeatmap = (from, to) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  return api.get(`/stats/heatmap${qs ? `?${qs}` : ''}`);
};
export const getGlobalActivity = (from, to) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();
  return api.get(`/stats/activity${qs ? `?${qs}` : ''}`);
};
