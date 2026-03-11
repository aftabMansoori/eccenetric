import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import assetRoutes from './routes/asset.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());

// Main Routes
app.use('/api/v1/assets', assetRoutes);

// Error Handling
app.use(errorHandler);

export default app;
