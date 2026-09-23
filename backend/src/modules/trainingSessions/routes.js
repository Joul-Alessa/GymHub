import { Router } from 'express';
import {
  getSessions,
  getSession,
  postSession,
  deleteSession,
  postEntry,
  putEntry,
  deleteEntry,
} from './controller.js';

const router = Router();

router.get('/', getSessions);
router.post('/', postSession);
router.get('/:id', getSession);
router.delete('/:id', deleteSession);
router.post('/:id/entries', postEntry);
router.put('/:id/entries/:entryId', putEntry);
router.delete('/:id/entries/:entryId', deleteEntry);

export default router;
