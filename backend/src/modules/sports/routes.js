import { Router } from 'express';
import { getSports, postSport, putSport } from './controller.js';

const router = Router();

router.get('/', getSports);
router.post('/', postSport);
router.put('/:id', putSport);

export default router;
