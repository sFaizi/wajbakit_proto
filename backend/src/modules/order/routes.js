import { Router } from 'express';
import * as orderController from './controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrderSchema,
} from './validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

// All order routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Get current user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User's orders
 */
router.get('/my', orderController.getMyOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order placed
 */
router.post('/', validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:id', validate(getOrderSchema), orderController.getOrder);

// Admin-only routes
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders
 */
router.get('/', authorize('admin'), orderController.getAllOrders);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put(
  '/:id/status',
  authorize('admin'),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus,
);

export default router;
