import fs from 'node:fs';
import path from 'node:path';
import { ApiError } from '../../middleware/errorHandler.js';
import { uploadsDir } from '../../middleware/upload.js';
import * as exercisesRepo from './repository.js';
import * as sportsRepo from '../sports/repository.js';
import * as subclassRepo from '../subclassifications/repository.js';
import * as metricsRepo from '../metrics/repository.js';

function validateSubclassifications(sportId, subclassificationIds) {
  for (const subId of subclassificationIds) {
    const sub = subclassRepo.getSubclassificationById(subId);
    if (!sub) throw new ApiError(400, `Subclassification ${subId} not found`);
    if (String(sub.sport_id) !== String(sportId)) {
      throw new ApiError(400, `Subclassification ${subId} does not belong to the exercise's sport`);
    }
  }
}

function validateCommonMetrics(commonMetrics) {
  for (const item of commonMetrics) {
    const metric = metricsRepo.getMetricById(item.metricId);
    if (!metric) throw new ApiError(400, `Metric ${item.metricId} not found`);
    if (item.defaultUnitId) {
      const unit = metricsRepo.getUnitById(item.defaultUnitId);
      if (!unit || String(unit.metric_id) !== String(item.metricId)) {
        throw new ApiError(400, `Unit ${item.defaultUnitId} does not belong to metric ${item.metricId}`);
      }
    }
  }
}

export function getExercises(req, res) {
  const { sportId, subclassificationId } = req.query;
  res.json(exercisesRepo.listExercises({ sportId, subclassificationId }));
}

export function getExercise(req, res) {
  const exercise = exercisesRepo.getExerciseById(req.params.id);
  if (!exercise) throw new ApiError(404, 'Exercise not found');
  res.json(exercise);
}

export function postExercise(req, res) {
  const name = (req.body?.name || '').trim();
  const description = req.body?.description || '';
  const sportId = Number(req.body?.sportId);
  const subclassificationIds = Array.isArray(req.body?.subclassificationIds) ? req.body.subclassificationIds : [];
  const commonMetrics = Array.isArray(req.body?.commonMetrics) ? req.body.commonMetrics : [];

  if (!name) throw new ApiError(400, 'name is required');
  if (!sportId || !sportsRepo.getSportById(sportId)) throw new ApiError(400, 'Valid sportId is required');
  validateSubclassifications(sportId, subclassificationIds);
  validateCommonMetrics(commonMetrics);

  const id = exercisesRepo.createExercise({ name, description, sportId });
  exercisesRepo.setExerciseSubclassifications(id, subclassificationIds);
  exercisesRepo.setExerciseCommonMetrics(id, commonMetrics);
  res.status(201).json(exercisesRepo.getExerciseById(id));
}

export function putExercise(req, res) {
  const { id } = req.params;
  const existing = exercisesRepo.getExerciseRaw(id);
  if (!existing) throw new ApiError(404, 'Exercise not found');

  const name = (req.body?.name || '').trim();
  const description = req.body?.description || '';
  const sportId = Number(req.body?.sportId);
  const subclassificationIds = Array.isArray(req.body?.subclassificationIds) ? req.body.subclassificationIds : [];
  const commonMetrics = Array.isArray(req.body?.commonMetrics) ? req.body.commonMetrics : [];

  if (!name) throw new ApiError(400, 'name is required');
  if (!sportId || !sportsRepo.getSportById(sportId)) throw new ApiError(400, 'Valid sportId is required');
  validateSubclassifications(sportId, subclassificationIds);
  validateCommonMetrics(commonMetrics);

  exercisesRepo.updateExercise(id, { name, description, sportId });
  exercisesRepo.setExerciseSubclassifications(id, subclassificationIds);
  exercisesRepo.setExerciseCommonMetrics(id, commonMetrics);
  res.json(exercisesRepo.getExerciseById(id));
}

export function deleteExercise(req, res) {
  const { id } = req.params;
  const existing = exercisesRepo.getExerciseRaw(id);
  if (!existing) throw new ApiError(404, 'Exercise not found');
  if (exercisesRepo.countTrainingEntries(id) > 0) {
    throw new ApiError(409, 'Cannot delete an exercise that has logged training entries');
  }
  for (const photo of exercisesRepo.getExerciseById(id).photos) {
    const absolute = path.join(uploadsDir, path.basename(photo.file_path));
    fs.rm(absolute, { force: true }, () => {});
  }
  exercisesRepo.deleteExercise(id);
  res.status(204).end();
}

export function postExercisePhoto(req, res) {
  const { id } = req.params;
  const existing = exercisesRepo.getExerciseRaw(id);
  if (!existing) throw new ApiError(404, 'Exercise not found');
  if (!req.file) throw new ApiError(400, 'photo file is required');
  const position = exercisesRepo.countPhotos(id);
  const relativePath = `/uploads/${req.file.filename}`;
  const photo = exercisesRepo.addPhoto(id, relativePath, position);
  res.status(201).json(photo);
}

export function deleteExercisePhoto(req, res) {
  const { id, photoId } = req.params;
  const photo = exercisesRepo.getPhotoById(photoId);
  if (!photo || String(photo.exercise_id) !== String(id)) throw new ApiError(404, 'Photo not found');
  const absolute = path.join(uploadsDir, path.basename(photo.file_path));
  fs.rm(absolute, { force: true }, () => {});
  exercisesRepo.deletePhoto(photoId);
  res.status(204).end();
}
