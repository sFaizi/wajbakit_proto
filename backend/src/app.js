import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import logger from './utils/logger.js';
import ApiError from './utils/ApiError.js';
import errorHandler from './middlewares/errorHandler.js';

// Module routes
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/user/routes.js';
import productRoutes from './modules/product/routes.js';
import orderRoutes from './modules/order/routes.js';

const app = express();

// --------------- Global Middlewares ---------------

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Gzip compression
app.use(compression());

// HTTP request logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    }),
  );
}

// --------------- API Routes ---------------

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// --------------- Swagger Docs ---------------

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'wajbakit_proto API Docs',
  }),
);

// --------------- Health Check ---------------

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// --------------- 404 Handler ---------------

app.use((_req, _res, next) => {
  next(ApiError.notFound('Route not found'));
});

// --------------- Error Handler ---------------

app.use(errorHandler);

export default app;
