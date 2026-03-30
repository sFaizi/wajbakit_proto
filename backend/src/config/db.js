import mongoose from 'mongoose';
import logger from '../utils/logger.js';
import config from './index.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongo.uri);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
