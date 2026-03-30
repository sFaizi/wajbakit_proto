import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../features/products/productSlice';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import Input from '../components/Input';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, pagination, isLoading } = useSelector(
    (state) => state.products,
  );
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 12, search }));
  }, [dispatch, page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
        <div className='w-full sm:w-72'>
          <Input
            name='search'
            placeholder='Search products...'
            value={search}
            onChange={handleSearch}
            className='mb-0'
          />
        </div>
      </div>

      {isLoading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <p className='text-center text-gray-500 py-12'>No products found.</p>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className='bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group'
              >
                <div className='aspect-square bg-gray-100'>
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-400'>
                      No Image
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-semibold text-gray-900 truncate'>
                    {product.name}
                  </h3>
                  <p className='text-sm text-gray-500 mt-1'>
                    {product.category}
                  </p>
                  <div className='flex justify-between items-center mt-2'>
                    <span className='text-lg font-bold text-primary-600'>
                      ${product.price.toFixed(2)}
                    </span>
                    <span className='text-xs text-gray-400'>
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default ProductList;
