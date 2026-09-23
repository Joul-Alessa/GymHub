import express from 'express';
import cors from 'cors';
import { uploadsDir } from './middleware/upload.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import sportsRoutes from './modules/sports/routes.js';
import subclassificationsRoutes from './modules/subclassifications/routes.js';
import exercisesRoutes from './modules/exercises/routes.js';
import metricsRoutes from './modules/metrics/routes.js';
import trainingSessionsRoutes from './modules/trainingSessions/routes.js';
import statsRoutes from './modules/stats/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/sports', sportsRoutes);
app.use('/api/subclassifications', subclassificationsRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/training-sessions', trainingSessionsRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
