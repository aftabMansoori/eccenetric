import { Request, Response, NextFunction } from 'express';
import { AssetService } from '../services/AssetService.js';
import { UploadIntentSchema, ListAssetsSchema, ConfirmUploadSchema } from '../schemas/asset.schema.js';

export class AssetController {
  constructor(private assetService: AssetService) {}

  public getUploadIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = UploadIntentSchema.parse(req.body);
      const result = await this.assetService.prepareUpload(data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public confirmAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ConfirmUploadSchema.parse({ id: req.params.id });
      const asset = await this.assetService.confirmUpload(id);
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  };

  public listAssets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = ListAssetsSchema.parse(req.query);
      const result = await this.assetService.listAssets(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = ConfirmUploadSchema.parse({ id: req.params.id });
      const asset = await this.assetService.getAsset(id);
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  };
}
