import { Request, Response, NextFunction } from 'express';
import { AssetService } from '../services/AssetService.js';
import { UploadIntentSchema, ListAssetsSchema, ConfirmUploadSchema } from '../schemas/asset.schema.js';

export class AssetController {
  constructor(private assetService: AssetService) { }

  public getUploadIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const data = UploadIntentSchema.parse(req.body);
      const result = await this.assetService.prepareUpload(userId, data);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public confirmAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = ConfirmUploadSchema.parse({ id: req.params.id });
      const asset = await this.assetService.confirmUpload(userId, id);
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  };

  public listAssets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const filters = ListAssetsSchema.parse(req.query);
      const result = await this.assetService.listAssets(userId, filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = ConfirmUploadSchema.parse({ id: req.params.id });
      const asset = await this.assetService.getAsset(userId, id);
      res.status(200).json(asset);
    } catch (error) {
      next(error);
    }
  };

  public deleteAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = ConfirmUploadSchema.parse({ id: req.params.id });
      await this.assetService.deleteAsset(userId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public getAssetViewUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = ConfirmUploadSchema.parse({ id: req.params.id });
      const url = await this.assetService.generateViewUrl(userId, id);
      res.redirect(url);
    } catch (error) {
      next(error);
    }
  };
}
