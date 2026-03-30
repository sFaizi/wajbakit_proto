import User from './model.js';
import ApiError from '../../utils/ApiError.js';
import QueryBuilder from '../../utils/QueryBuilder.js';

/**
 * Get all users with pagination, search, and filtering.
 */
export const getUsers = async (queryParams) => {
  const qb = new QueryBuilder(User, queryParams);
  qb.search(['name', 'email']).filter().sort().selectFields();
  const pagination = await qb.paginate();
  const users = await qb.exec();

  return { users, pagination };
};

/**
 * Get a single user by ID.
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

/**
 * Update user by ID.
 */
export const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

/**
 * Delete user by ID.
 */
export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user;
};

/**
 * Change password for the authenticated user.
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw ApiError.notFound('User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.badRequest('Current password is incorrect');

  user.password = newPassword;
  await user.save();
  return user;
};
