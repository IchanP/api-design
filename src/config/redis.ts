
import { createClient } from 'redis';

/**
 * Establishes a conenction to the redis database.
 *
 * @param {string} connectionString - The url to connect to.
 */
export const connectToRedis = async (connectionString: string | undefined) => {
    const redisClient = createClient({
        url: connectionString
    });
    await redisClient.connect();
    if (!redisClient.isReady) {
        console.error('Redis connection error occurred.');
        throw new Error('Redis connection error occurred.');
    } else {
        console.log('Redis connection opened.');
    }
    return redisClient;
};
