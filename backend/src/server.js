import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(config.port, () => {
    logger.info(
      `[${config.projectName}] Server running in ${config.env} mode on port ${config.port}`,
    );
    logger.info(
      `API docs available at http://localhost:${config.port}/api-docs`,
    );
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();
