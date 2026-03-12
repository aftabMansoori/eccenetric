import { Router } from 'express';

import { AssetController } from '../controllers/AssetController.js';
import { AssetService } from '../services/AssetService.js';
import { GCSStorageProvider } from '../providers/GCSStorageProvider.js';
import { authenticate } from '../middlewares/authentication.js';

const router = Router();

// Dependecy Injection Setup
const storageProvider = new GCSStorageProvider();
const assetService = new AssetService(storageProvider);
const assetController = new AssetController(assetService);

// Endpoints
router.post('/upload-intent', authenticate, assetController.getUploadIntent);
router.post('/confirm/:id', authenticate, assetController.confirmAsset);
router.get('/', authenticate, assetController.listAssets);
router.get('/:id', authenticate, assetController.getAsset);
router.delete('/:id', authenticate, assetController.deleteAsset);
router.get('/:id/view', authenticate, assetController.getAssetViewUrl);

export default router;
