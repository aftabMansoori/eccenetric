import { Router } from 'express';
import { AssetController } from '../controllers/AssetController.js';
import { AssetService } from '../services/AssetService.js';
import { GCSStorageProvider } from '../providers/GCSStorageProvider.js';

const router = Router();

// Dependecy Injection Setup
const storageProvider = new GCSStorageProvider();
const assetService = new AssetService(storageProvider);
const assetController = new AssetController(assetService);

// Endpoints
router.post('/upload-intent', assetController.getUploadIntent);
router.patch('/:id/confirm', assetController.confirmAsset);
router.get('/', assetController.listAssets);
router.get('/:id', assetController.getAsset);

export default router;
