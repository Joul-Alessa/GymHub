import { Router } from 'express';
import { getSubclassifications, postSubclassification, putSubclassification } from './controller.js';

const router = Router();

router.get('/', getSubclassifications);
router.post('/', postSubclassification);
router.put('/:id', putSubclassification);

export default router;
