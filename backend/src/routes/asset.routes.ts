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
router.post('/confirm/:id', assetController.confirmAsset);
router.get('/', assetController.listAssets);
router.get('/:id', assetController.getAsset);
router.delete('/:id', assetController.deleteAsset);
router.get('/:id/view', assetController.getAssetViewUrl);

export default router;
