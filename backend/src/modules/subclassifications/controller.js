import { ApiError } from '../../middleware/errorHandler.js';
import * as subclassRepo from './repository.js';
import * as sportsRepo from '../sports/repository.js';

export function getSubclassifications(req, res) {
  const { sportId } = req.query;
  res.json(subclassRepo.listSubclassifications(sportId));
}

export function postSubclassification(req, res) {
  const sportId = Number(req.body?.sportId);
  const name = (req.body?.name || '').trim();
  if (!sportId || !name) throw new ApiError(400, 'sportId and name are required');
  if (!sportsRepo.getSportById(sportId)) throw new ApiError(404, 'Sport not found');
  if (subclassRepo.findByName(sportId, name)) throw new ApiError(409, 'Subclassification already exists for this sport');
  res.status(201).json(subclassRepo.createSubclassification(sportId, name));
}

export function putSubclassification(req, res) {
  const { id } = req.params;
  const name = (req.body?.name || '').trim();
  if (!name) throw new ApiError(400, 'name is required');
  const existing = subclassRepo.getSubclassificationById(id);
  if (!existing) throw new ApiError(404, 'Subclassification not found');
  const duplicate = subclassRepo.findByName(existing.sport_id, name);
  if (duplicate && String(duplicate.id) !== String(id)) throw new ApiError(409, 'Subclassification already exists for this sport');
  res.json(subclassRepo.updateSubclassification(id, name));
}
