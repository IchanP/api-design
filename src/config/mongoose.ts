import mongoose from 'mongoose';

/**
 * Establish a connection to the mongoDB database.
 *
 * @param {string} connectionString - The url to connect to mongodb with.
 * @returns { Promise} Resolves to this if the connection suceeded
 */
export const connectDB = async (connectionString : string) => {
  const { connection } = mongoose;

  // Bind connection to events (to get notifications).
  connection.on('connected', () => console.log('MongoDB connection opened.'));
  connection.on('error', err => console.error(`MongoDB connection error occurred: ${err}`));
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'));

  // If the Node.js process ends, close the connection.
  process.on('SIGINT', async () => {
    await connection.close(true);
    console.log('MongoDB connection closed due to Node.js process termination.');
    process.exit(0);
  });

  // Connect to the server.
  return mongoose.connect(connectionString);
};
