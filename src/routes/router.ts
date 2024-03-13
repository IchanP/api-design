import express from 'express';
import createError from 'http-errors';
import { router as v1Router } from './v1/router.ts'

export const router = express.Router();

router.use('/v1', v1Router)

// TODO
router.use('*', (req, res, next) => next(createError(404)))