import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Generate JWT access token.
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Generate JWT refresh token (longer-lived, same secret).
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign({ ...payload, type: 'refresh' }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * Verify JWT access token.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

/**
 * Verify JWT refresh token.
 */
export const verifyRefreshToken = (token) => {
  const decoded = jwt.verify(token, config.jwt.secret);
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  return decoded;
};
