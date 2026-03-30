import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as authService from './service.js';
import config from '../../config/index.js';

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 */
export const signup = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.signup(
    req.body,
  );

  setRefreshTokenCookie(res, refreshToken);

  return ApiResponse.created(res, 'User registered successfully', {
    user,
    accessToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  setRefreshTokenCookie(res, refreshToken);

  return ApiResponse.success(res, 'Login successful', {
    user,
    accessToken,
  });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh-token
 */
export const refreshToken = asyncHandler(async (req, res) => {
  // Accept from body or HTTP-only cookie
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  const tokens = await authService.refreshAccessToken(token);

  setRefreshTokenCookie(res, tokens.refreshToken);

  return ApiResponse.success(res, 'Token refreshed', {
    accessToken: tokens.accessToken,
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  res.clearCookie('refreshToken');

  return ApiResponse.success(res, 'Logged out successfully');
});

/**
 * @desc    Get current authenticated user
 * @route   GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'User fetched', req.user);
});

// --- Helpers ---

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });
}
