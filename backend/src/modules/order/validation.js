import Joi from 'joi';

const orderItemSchema = Joi.object({
  product: Joi.string().hex().length(24).required(),
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  quantity: Joi.number().integer().min(1).required(),
  image: Joi.string().uri().allow(''),
});

const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
});

export const createOrderSchema = {
  body: Joi.object({
    items: Joi.array().items(orderItemSchema).min(1).required(),
    shippingAddress: addressSchema.required(),
    paymentMethod: Joi.string().valid('card', 'cash', 'wallet').default('cash'),
    notes: Joi.string().max(500).allow(''),
  }),
};

export const updateOrderStatusSchema = {
  body: Joi.object({
    status: Joi.string()
      .valid(
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      )
      .required(),
  }),
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};

export const getOrderSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
