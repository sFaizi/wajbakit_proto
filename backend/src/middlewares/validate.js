import ApiError from '../utils/ApiError.js';

/**
 * Joi validation middleware factory.
 * @param {Object} schema - Joi schema with optional body, params, query keys.
 */
const validate = (schema) => (req, _res, next) => {
  const validationErrors = [];

  for (const key of ['body', 'params', 'query']) {
    if (schema[key]) {
      const { error, value } = schema[key].validate(req[key], {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        const messages = error.details.map((d) => d.message);
        validationErrors.push(...messages);
      } else {
        req[key] = value; // replace with sanitized values
      }
    }
  }

  if (validationErrors.length > 0) {
    return next(ApiError.badRequest('Validation failed', validationErrors));
  }

  next();
};

export default validate;
