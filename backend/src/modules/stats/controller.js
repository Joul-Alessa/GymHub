import { ApiError } from '../../middleware/errorHandler.js';
import * as sessionsRepo from '../trainingSessions/repository.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function resolveRange(query) {
  const to = query.to && DATE_RE.test(query.to) ? query.to : new Date().toISOString().slice(0, 10);
  let from = query.from && DATE_RE.test(query.from) ? query.from : null;
  if (!from) {
    const d = new Date(to);
    d.setDate(d.getDate() - 364);
    from = d.toISOString().slice(0, 10);
  }
  if (from > to) throw new ApiError(400, 'from must be before to');
  return { from, to };
}

export function getHeatmap(req, res) {
  const { from, to } = resolveRange(req.query);
  res.json({ from, to, days: sessionsRepo.getHeatmapData(from, to) });
}

export function getGlobalActivity(req, res) {
  const { from, to } = resolveRange(req.query);
  res.json({ from, to, days: sessionsRepo.getGlobalActivity(from, to) });
}
