import User from '../user/model.js';
import ApiError from '../../utils/ApiError.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../utils/token.js';

/**
 * Register a new user.
 */
export const signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const user = await User.create({ name, email, password });

  const tokens = generateTokens(user);
  await saveRefreshToken(user._id, tokens.refreshToken);

  return { user, ...tokens };
};

/**
 * Authenticate user and return tokens.
 */
export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const tokens = generateTokens(user);
  await saveRefreshToken(user._id, tokens.refreshToken);

  // Remove password from response
  user.password = undefined;

  return { user, ...tokens };
};

/**
 * Refresh access token using a valid refresh token.
 */
export const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const tokens = generateTokens(user);
  await saveRefreshToken(user._id, tokens.refreshToken);

  return tokens;
};

/**
 * Logout — clear refresh token.
 */
export const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

// --- Helper functions ---

function generateTokens(user) {
  const payload = { id: user._id, role: user.role };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

async function saveRefreshToken(userId, refreshToken) {
  await User.findByIdAndUpdate(userId, { refreshToken });
}
