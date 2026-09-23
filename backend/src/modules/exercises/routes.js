import { Router } from 'express';
import { upload } from '../../middleware/upload.js';
import {
  getExercises,
  getExercise,
  postExercise,
  putExercise,
  deleteExercise,
  postExercisePhoto,
  deleteExercisePhoto,
} from './controller.js';
import { getExerciseHistory, getExerciseProgress } from '../trainingSessions/controller.js';

const router = Router();

router.get('/', getExercises);
router.post('/', postExercise);
router.get('/:id', getExercise);
router.put('/:id', putExercise);
router.delete('/:id', deleteExercise);
router.post('/:id/photos', upload.single('photo'), postExercisePhoto);
router.delete('/:id/photos/:photoId', deleteExercisePhoto);
router.get('/:id/history', getExerciseHistory);
router.get('/:id/progress', getExerciseProgress);

export default router;
