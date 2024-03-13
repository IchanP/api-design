import { AuthController } from 'controller/AuthController.ts';
import express from 'express';
import { container } from 'config/inversify.config.ts';
import { TYPES } from 'config/types.ts';

export const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);

router.post('/register', (req, res, next) => controller.register(req, res, next));
router.post('/login', (req, res) => res.json({ message: 'Hello to login page!' }));
