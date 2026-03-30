import Joi from 'joi';

export const updateUserSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().email(),
    role: Joi.string().valid('user', 'admin'),
    isActive: Joi.boolean(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const getUserSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const changePasswordSchema = {
  body: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).max(128).required(),
  }),
};
