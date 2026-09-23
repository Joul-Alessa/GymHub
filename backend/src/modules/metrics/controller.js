import { ApiError } from '../../middleware/errorHandler.js';
import * as metricsRepo from './repository.js';

export function getMetrics(req, res) {
  res.json(metricsRepo.listMetrics());
}

export function postMetric(req, res) {
  const name = (req.body?.name || '').trim();
  if (!name) throw new ApiError(400, 'name is required');
  if (metricsRepo.findMetricByName(name)) throw new ApiError(409, 'Metric already exists');
  res.status(201).json(metricsRepo.createMetric(name));
}

export function putMetric(req, res) {
  const { id } = req.params;
  const name = (req.body?.name || '').trim();
  if (!name) throw new ApiError(400, 'name is required');
  if (!metricsRepo.getMetricById(id)) throw new ApiError(404, 'Metric not found');
  const duplicate = metricsRepo.findMetricByName(name);
  if (duplicate && String(duplicate.id) !== String(id)) throw new ApiError(409, 'Metric already exists');
  res.json(metricsRepo.updateMetric(id, name));
}

export function getUnits(req, res) {
  const metric = metricsRepo.getMetricById(req.params.metricId);
  if (!metric) throw new ApiError(404, 'Metric not found');
  res.json(metricsRepo.listUnits(metric.id));
}

export function postUnit(req, res) {
  const metric = metricsRepo.getMetricById(req.params.metricId);
  if (!metric) throw new ApiError(404, 'Metric not found');
  const name = (req.body?.name || '').trim();
  const abbreviation = (req.body?.abbreviation || '').trim();
  if (!name || !abbreviation) throw new ApiError(400, 'name and abbreviation are required');
  if (metricsRepo.findUnitByAbbreviation(metric.id, abbreviation)) {
    throw new ApiError(409, 'Unit already exists for this metric');
  }
  res.status(201).json(metricsRepo.createUnit(metric.id, name, abbreviation));
}

export function putUnit(req, res) {
  const { id } = req.params;
  const name = (req.body?.name || '').trim();
  const abbreviation = (req.body?.abbreviation || '').trim();
  if (!name || !abbreviation) throw new ApiError(400, 'name and abbreviation are required');
  const existing = metricsRepo.getUnitById(id);
  if (!existing) throw new ApiError(404, 'Unit not found');
  const duplicate = metricsRepo.findUnitByAbbreviation(existing.metric_id, abbreviation);
  if (duplicate && String(duplicate.id) !== String(id)) throw new ApiError(409, 'Unit already exists for this metric');
  res.json(metricsRepo.updateUnit(id, name, abbreviation));
}
