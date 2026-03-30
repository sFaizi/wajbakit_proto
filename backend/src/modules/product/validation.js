import Joi from 'joi';

export const createProductSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200).required(),
    description: Joi.string().trim().min(10).max(2000).required(),
    price: Joi.number().min(0).required(),
    category: Joi.string().trim().required(),
    stock: Joi.number().integer().min(0).default(0),
  }),
};

export const updateProductSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(200),
    description: Joi.string().trim().min(10).max(2000),
    price: Joi.number().min(0),
    category: Joi.string().trim(),
    stock: Joi.number().integer().min(0),
    isActive: Joi.boolean(),
  }).min(1),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const getProductSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
