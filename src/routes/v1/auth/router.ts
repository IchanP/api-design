import { AuthController } from 'controller/AuthController.ts';
import express from 'express';
import { container, TYPES } from 'config/inversify.config.ts';

export const router = express.Router();
const controller = container.get<AuthController>(TYPES.AuthController);


router.post('/register', (req, res) => controller.register(req, res));
router.get('/login', (req, res) => res.json({ message: 'Hello to login page!' }));