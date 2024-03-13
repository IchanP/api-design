/**
 * Starting point of the app.
 * 
 * @author Pontus Grandin
 */
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import dotenv from "dotenv";
import { connectToRedis } from "./config/redis.js";
import { router } from "routes/router.ts";

try {

    dotenv.config();
    const app = express();

    await connectToRedis(process.env.REDIS_CONNECT_STRING);

    // Boiler plate for security and logging
    app.use(helmet());
    app.use(express.json());
    app.use(logger('dev'));

    app.use('/', router);
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`);
        console.log('Press Ctrl-C to terminate...');
    });
} catch (e: unknown) {
    console.error(e);
    process.exitCode = 1;
}