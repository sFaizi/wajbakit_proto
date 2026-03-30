import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, clearProduct } from '../features/products/productSlice';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProduct(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  if (isLoading || !product) return <Spinner />;

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        {/* Images */}
        <div className='aspect-square bg-gray-100 rounded-xl overflow-hidden'>
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-gray-400 text-lg'>
              No Image
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className='text-sm text-primary-600 font-medium'>
            {product.category}
          </span>
          <h1 className='text-3xl font-bold text-gray-900 mt-1'>
            {product.name}
          </h1>

          <div className='flex items-center gap-2 mt-3'>
            <span className='text-2xl font-bold text-primary-600'>
              ${product.price.toFixed(2)}
            </span>
            {product.ratings?.average > 0 && (
              <span className='text-sm text-gray-500'>
                ⭐ {product.ratings.average.toFixed(1)} ({product.ratings.count}{' '}
                reviews)
              </span>
            )}
          </div>

          <p className='mt-4 text-gray-600 leading-relaxed'>
            {product.description}
          </p>

          <div className='mt-6'>
            <span
              className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className='mt-6'>
            <Button size='lg' disabled={product.stock === 0}>
              Add to Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
