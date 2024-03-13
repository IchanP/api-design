import { AuthController } from 'controller/AuthController.ts';
import express, { Request, Response, NextFunction } from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';
import { validateAuthScheme } from '../../../Utils/index.ts';

export const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

router.post('/register', (req, res, next) => controller.register(req, res, next));
router.post('/login', (req, res, next) => controller.login(req, res, next));

router.post('/refresh', (req: Request, res: Response, next: NextFunction) =>
  validateAuthScheme(req, res, next),
(req: Request, res: Response, next: NextFunction) => controller.refresh(req, res, next)
);
