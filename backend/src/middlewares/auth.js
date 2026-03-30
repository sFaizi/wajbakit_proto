import { verifyAccessToken } from '../utils/token.js';
import ApiError from '../utils/ApiError.js';
import User from '../modules/user/model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect routes — requires a valid JWT access token.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  let token;

  // Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Fallback: check cookies
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw ApiError.unauthorized('Access denied. No token provided.');
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw ApiError.unauthorized('User not found. Token is invalid.');
  }

  req.user = user;
  next();
});

/**
 * Role-based authorization middleware.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user').
 */
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        'You do not have permission to perform this action.',
      );
    }
    next();
  };
};
