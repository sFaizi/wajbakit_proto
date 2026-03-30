import { Router } from 'express';
import * as userController from './controller.js';
import { authenticate, authorize } from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import {
  updateUserSchema,
  getUserSchema,
  changePasswordSchema,
} from './validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (admin) and profile
 */

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change own password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
router.put(
  '/change-password',
  validate(changePasswordSchema),
  userController.changePassword,
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Users]
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
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', authorize('admin'), userController.getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User details
 */
router.get(
  '/:id',
  authorize('admin'),
  validate(getUserSchema),
  userController.getUser,
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated
 */
router.put(
  '/:id',
  authorize('admin'),
  validate(updateUserSchema),
  userController.updateUser,
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete(
  '/:id',
  authorize('admin'),
  validate(getUserSchema),
  userController.deleteUser,
);

export default router;
