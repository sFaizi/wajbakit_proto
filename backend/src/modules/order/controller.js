import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as orderService from './service.js';

/**
 * @desc    Create a new order
 * @route   POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user._id);
  return ApiResponse.created(res, 'Order placed successfully', order);
});

/**
 * @desc    Get current user's orders
 * @route   GET /api/v1/orders/my
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getMyOrders(
    req.user._id,
    req.query,
  );
  return ApiResponse.success(res, 'Orders fetched', { orders, pagination });
});

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/v1/orders
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { orders, pagination } = await orderService.getAllOrders(req.query);
  return ApiResponse.success(res, 'Orders fetched', { orders, pagination });
});

/**
 * @desc    Get single order
 * @route   GET /api/v1/orders/:id
 */
export const getOrder = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const order = await orderService.getOrderById(
    req.params.id,
    isAdmin ? null : req.user._id,
  );
  return ApiResponse.success(res, 'Order fetched', order);
});

/**
 * @desc    Update order status (admin)
 * @route   PUT /api/v1/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status,
  );
  return ApiResponse.success(res, 'Order status updated', order);
});
