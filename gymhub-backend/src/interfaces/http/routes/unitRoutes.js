import express from 'express';
import { container } from '../../../container.js';

const router = express.Router();

router.get('/', (req, res) => container.unitController.getAll(req, res));
router.get('/:id', (req, res) => container.unitController.getById(req, res));

export default router;