import { ApiError } from '../../middleware/errorHandler.js';
import * as sessionsRepo from './repository.js';
import * as exercisesRepo from '../exercises/repository.js';
import * as metricsRepo from '../metrics/repository.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function validateMetrics(metrics) {
  if (!Array.isArray(metrics)) throw new ApiError(400, 'metrics must be an array');
  for (const m of metrics) {
    if (!m || typeof m.metricId === 'undefined' || typeof m.value === 'undefined') {
      throw new ApiError(400, 'Each metric requires metricId and value');
    }
    const metric = metricsRepo.getMetricById(m.metricId);
    if (!metric) throw new ApiError(400, `Metric ${m.metricId} not found`);
    if (m.unitId) {
      const unit = metricsRepo.getUnitById(m.unitId);
      if (!unit || String(unit.metric_id) !== String(m.metricId)) {
        throw new ApiError(400, `Unit ${m.unitId} does not belong to metric ${m.metricId}`);
      }
    }
    if (Number.isNaN(Number(m.value))) throw new ApiError(400, 'metric value must be numeric');
  }
}

export function getSessions(req, res) {
  const { from, to } = req.query;
  res.json(sessionsRepo.listSessions({ from, to }));
}

export function getSession(req, res) {
  const session = sessionsRepo.getSessionById(req.params.id);
  if (!session) throw new ApiError(404, 'Session not found');
  res.json(session);
}

export function postSession(req, res) {
  const sessionDate = req.body?.sessionDate;
  const notes = req.body?.notes || '';
  if (!sessionDate || !DATE_RE.test(sessionDate)) throw new ApiError(400, 'sessionDate must be YYYY-MM-DD');
  const existing = sessionsRepo.findSessionByDate(sessionDate);
  if (existing) throw new ApiError(409, 'A session already exists for this date');
  const id = sessionsRepo.createSession(sessionDate, notes);
  res.status(201).json(sessionsRepo.getSessionById(id));
}

export function deleteSession(req, res) {
  const { id } = req.params;
  if (!sessionsRepo.getSessionRaw(id)) throw new ApiError(404, 'Session not found');
  sessionsRepo.deleteSession(id);
  res.status(204).end();
}

export function postEntry(req, res) {
  const { id: sessionId } = req.params;
  const session = sessionsRepo.getSessionRaw(sessionId);
  if (!session) throw new ApiError(404, 'Session not found');

  const exerciseId = Number(req.body?.exerciseId);
  const difficulty = Number(req.body?.difficulty);
  const notes = req.body?.notes || '';
  const metrics = req.body?.metrics || [];

  if (!exerciseId || !exercisesRepo.getExerciseRaw(exerciseId)) throw new ApiError(400, 'Valid exerciseId is required');
  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    throw new ApiError(400, 'difficulty must be an integer between 1 and 5');
  }
  validateMetrics(metrics);

  const entryId = sessionsRepo.addEntry(sessionId, { exerciseId, difficulty, notes, metrics });
  res.status(201).json(sessionsRepo.getSessionById(sessionId).entries.find((e) => e.id === entryId));
}

export function putEntry(req, res) {
  const { id: sessionId, entryId } = req.params;
  const entry = sessionsRepo.getEntryById(entryId);
  if (!entry || String(entry.session_id) !== String(sessionId)) throw new ApiError(404, 'Entry not found');

  const difficulty = Number(req.body?.difficulty);
  const notes = req.body?.notes || '';
  const metrics = req.body?.metrics || [];

  if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5) {
    throw new ApiError(400, 'difficulty must be an integer between 1 and 5');
  }
  validateMetrics(metrics);

  sessionsRepo.updateEntry(entryId, { difficulty, notes, metrics });
  res.json(sessionsRepo.getSessionById(sessionId).entries.find((e) => String(e.id) === String(entryId)));
}

export function deleteEntry(req, res) {
  const { id: sessionId, entryId } = req.params;
  const entry = sessionsRepo.getEntryById(entryId);
  if (!entry || String(entry.session_id) !== String(sessionId)) throw new ApiError(404, 'Entry not found');
  sessionsRepo.deleteEntry(entryId);
  res.status(204).end();
}

export function getExerciseHistory(req, res) {
  const { id } = req.params;
  if (!exercisesRepo.getExerciseRaw(id)) throw new ApiError(404, 'Exercise not found');
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  res.json(sessionsRepo.getExerciseHistory(id, limit));
}

export function getExerciseProgress(req, res) {
  const { id } = req.params;
  const { metricId } = req.query;
  if (!exercisesRepo.getExerciseRaw(id)) throw new ApiError(404, 'Exercise not found');
  if (!metricId || !metricsRepo.getMetricById(metricId)) throw new ApiError(400, 'Valid metricId is required');
  res.json(sessionsRepo.getExerciseProgress(id, metricId));
}
