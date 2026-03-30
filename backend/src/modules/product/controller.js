import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as productService from './service.js';

/**
 * @desc    Get all products
 * @route   GET /api/v1/products
 */
export const getProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getProducts(req.query);
  return ApiResponse.success(res, 'Products fetched', { products, pagination });
});

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:id
 */
export const getProduct = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return ApiResponse.success(res, 'Product fetched', product);
});

/**
 * @desc    Create product (admin)
 * @route   POST /api/v1/products
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  return ApiResponse.created(res, 'Product created', product);
});

/**
 * @desc    Update product (admin)
 * @route   PUT /api/v1/products/:id
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return ApiResponse.success(res, 'Product updated', product);
});

/**
 * @desc    Delete product (admin)
 * @route   DELETE /api/v1/products/:id
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return ApiResponse.success(res, 'Product deleted');
});

/**
 * @desc    Upload product images (admin)
 * @route   POST /api/v1/products/:id/images
 */
export const uploadImages = asyncHandler(async (req, res) => {
  const product = await productService.uploadProductImages(
    req.params.id,
    req.files,
  );
  return ApiResponse.success(res, 'Images uploaded', product);
});
