import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as userService from './service.js';

/**
 * @desc    Get all users (admin)
 * @route   GET /api/v1/users
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { users, pagination } = await userService.getUsers(req.query);
  return ApiResponse.success(res, 'Users fetched', { users, pagination });
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 */
export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return ApiResponse.success(res, 'User fetched', user);
});

/**
 * @desc    Update user (admin)
 * @route   PUT /api/v1/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return ApiResponse.success(res, 'User updated', user);
});

/**
 * @desc    Delete user (admin)
 * @route   DELETE /api/v1/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return ApiResponse.success(res, 'User deleted');
});

/**
 * @desc    Change own password
 * @route   PUT /api/v1/users/change-password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await userService.changePassword(req.user._id, currentPassword, newPassword);
  return ApiResponse.success(res, 'Password changed successfully');
});
