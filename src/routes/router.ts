import express from 'express';
import createError from 'http-errors';
import { router as authRouter } from './auth/router.ts';
import { router as animeRouter } from './anime/router.ts';
export const router = express.Router();

router.use('/auth', authRouter
/*
#swagger.tags = ['auth']
*/
);

router.use('/anime', animeRouter);

// TODO
router.use('*', (req, res, next) => next(createError(404)));
