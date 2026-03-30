import Product from './model.js';
import ApiError from '../../utils/ApiError.js';
import QueryBuilder from '../../utils/QueryBuilder.js';
import cloudinary from '../../config/cloudinary.js';

/**
 * Get all products with pagination, search, filtering, sorting.
 */
export const getProducts = async (queryParams) => {
  const qb = new QueryBuilder(Product, queryParams);
  qb.search(['name', 'description', 'category']).filter().sort().selectFields();
  const pagination = await qb.paginate();
  const products = await qb.exec();

  return { products, pagination };
};

/**
 * Get a single product by ID.
 */
export const getProductById = async (productId) => {
  const product = await Product.findById(productId).populate(
    'createdBy',
    'name email',
  );
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

/**
 * Create a new product.
 */
export const createProduct = async (productData, userId) => {
  const product = await Product.create({ ...productData, createdBy: userId });
  return product;
};

/**
 * Update a product.
 */
export const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!product) throw ApiError.notFound('Product not found');
  return product;
};

/**
 * Delete a product and clean up Cloudinary images.
 */
export const deleteProduct = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  // Remove images from Cloudinary
  for (const image of product.images) {
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
  }

  await product.deleteOne();
  return product;
};

/**
 * Upload images to Cloudinary and add to product.
 */
export const uploadProductImages = async (productId, files) => {
  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  const uploadPromises = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'wajbakit/products' },
          (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url, publicId: result.public_id });
          },
        );
        stream.end(file.buffer);
      }),
  );

  const uploaded = await Promise.all(uploadPromises);
  product.images.push(...uploaded);
  await product.save();

  return product;
};
