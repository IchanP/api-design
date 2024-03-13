import express from 'express';
import { router as authRouter} from './auth/router.ts';

export const router = express.Router();

router.use('/auth', authRouter);