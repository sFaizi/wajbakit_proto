import { Router } from 'express';
import * as productController from './controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import upload from '../../middlewares/upload.js';
import {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} from './validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products (public)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID (public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', validate(getProductSchema), productController.getProduct);

// Admin routes below
router.use(authenticate, authorize('admin'));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/',
  validate(createProductSchema),
  productController.createProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put(
  '/:id',
  validate(updateProductSchema),
  productController.updateProduct,
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete(
  '/:id',
  validate(getProductSchema),
  productController.deleteProduct,
);

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     summary: Upload product images (admin, max 5)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded
 */
router.post(
  '/:id/images',
  upload.array('images', 5),
  productController.uploadImages,
);

export default router;
