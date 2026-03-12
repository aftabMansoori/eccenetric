import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';

import assetRoutes from './routes/asset.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.get("/_healthz", (req, res) => {
    res.json({ message: "OK" });
})

// Main Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/assets', assetRoutes);

// Error Handling
app.use(errorHandler);

export default app;
