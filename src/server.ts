/**
 * Starting point of the app.
 * 
 * @author Pontus Grandin
 */
import express from "express";
import helmet from "helmet";
import logger from "morgan";
import dotenv from "dotenv";
try {
    
    dotenv.config()
    const app = express()

    // Boiler plate for security and logging
    app.use(helmet())
    app.use(express.json())
    app.use(logger('dev'))

    // TODO error handling


    app.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}`)
        console.log('Press Ctrl-C to terminate...')
    })
} catch (e: unknown) {
    console.error(e)
    process.exitCode = 1
}