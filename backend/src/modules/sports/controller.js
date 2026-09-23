import { ApiError } from '../../middleware/errorHandler.js';
import * as sportsRepo from './repository.js';

export function getSports(req, res) {
  res.json(sportsRepo.listSports());
}

export function postSport(req, res) {
  const name = (req.body?.name || '').trim();
  if (!name) throw new ApiError(400, 'name is required');
  if (sportsRepo.findSportByName(name)) throw new ApiError(409, 'Sport already exists');
  res.status(201).json(sportsRepo.createSport(name));
}

export function putSport(req, res) {
  const { id } = req.params;
  const name = (req.body?.name || '').trim();
  if (!name) throw new ApiError(400, 'name is required');
  const existing = sportsRepo.getSportById(id);
  if (!existing) throw new ApiError(404, 'Sport not found');
  const duplicate = sportsRepo.findSportByName(name);
  if (duplicate && String(duplicate.id) !== String(id)) throw new ApiError(409, 'Sport already exists');
  res.json(sportsRepo.updateSport(id, name));
}
