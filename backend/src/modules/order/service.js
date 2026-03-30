import Order from './model.js';
import Product from '../product/model.js';
import ApiError from '../../utils/ApiError.js';
import QueryBuilder from '../../utils/QueryBuilder.js';

/**
 * Create a new order and decrement product stock.
 */
export const createOrder = async (orderData, userId) => {
  // Validate stock availability
  for (const item of orderData.items) {
    const product = await Product.findById(item.product);
    if (!product) throw ApiError.notFound(`Product not found: ${item.product}`);
    if (product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for "${product.name}"`);
    }
  }

  // Calculate totals
  const itemsTotal = orderData.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingCost = itemsTotal > 100 ? 0 : 10; // Free shipping over 100
  const tax = +(itemsTotal * 0.05).toFixed(2); // 5% tax
  const totalAmount = +(itemsTotal + shippingCost + tax).toFixed(2);

  const order = await Order.create({
    ...orderData,
    user: userId,
    itemsTotal,
    shippingCost,
    tax,
    totalAmount,
  });

  // Decrement stock
  for (const item of orderData.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  return order;
};

/**
 * Get orders for the authenticated user.
 */
export const getMyOrders = async (userId, queryParams) => {
  const qb = new QueryBuilder(Order, { ...queryParams, user: userId });
  qb.filter().sort();
  const pagination = await qb.paginate();
  const orders = await qb.exec();

  return { orders, pagination };
};

/**
 * Get all orders (admin).
 */
export const getAllOrders = async (queryParams) => {
  const qb = new QueryBuilder(Order, queryParams);
  qb.filter().sort();
  const pagination = await qb.paginate();
  const orders = await qb.query.populate('user', 'name email');

  return { orders, pagination };
};

/**
 * Get single order by ID.
 */
export const getOrderById = async (orderId, userId = null) => {
  const order = await Order.findById(orderId)
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  if (!order) throw ApiError.notFound('Order not found');

  // Non-admin can only view their own orders
  if (userId && order.user._id.toString() !== userId.toString()) {
    throw ApiError.forbidden('Not authorized to view this order');
  }

  return order;
};

/**
 * Update order status (admin).
 */
export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  // Prevent updating cancelled/delivered orders
  if (['cancelled', 'delivered'].includes(order.status)) {
    throw ApiError.badRequest(`Cannot update a ${order.status} order`);
  }

  order.status = status;

  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.paymentStatus = 'paid';
  }
  if (status === 'cancelled') {
    order.cancelledAt = new Date();
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  await order.save();
  return order;
};
