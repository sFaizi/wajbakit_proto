import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  deleteProduct,
  createProduct,
} from '../../features/products/productSlice';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products, pagination, isLoading } = useSelector(
    (state) => state.products,
  );
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    );
    if (createProduct.fulfilled.match(result)) {
      toast.success('Product created');
      setShowForm(false);
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
      });
      dispatch(fetchProducts({ page, limit: 10 }));
    } else {
      toast.error(result.payload || 'Failed to create');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const result = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success('Product deleted');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className='bg-white rounded-xl shadow-sm p-6 mb-8'
        >
          <div className='grid md:grid-cols-2 gap-4'>
            <Input
              label='Name'
              name='name'
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label='Category'
              name='category'
              value={form.category}
              onChange={handleChange}
              required
            />
            <Input
              label='Price'
              name='price'
              type='number'
              value={form.price}
              onChange={handleChange}
              required
            />
            <Input
              label='Stock'
              name='stock'
              type='number'
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div className='mt-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
            />
          </div>
          <Button type='submit' className='mt-4'>
            Create Product
          </Button>
        </form>
      )}

      {/* Products Table */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-50 text-left'>
            <tr>
              <th className='px-6 py-3 font-medium text-gray-500'>Name</th>
              <th className='px-6 py-3 font-medium text-gray-500'>Category</th>
              <th className='px-6 py-3 font-medium text-gray-500'>Price</th>
              <th className='px-6 py-3 font-medium text-gray-500'>Stock</th>
              <th className='px-6 py-3 font-medium text-gray-500'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {products.map((product) => (
              <tr key={product._id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 font-medium'>{product.name}</td>
                <td className='px-6 py-4 text-gray-500'>{product.category}</td>
                <td className='px-6 py-4'>${product.price.toFixed(2)}</td>
                <td className='px-6 py-4'>{product.stock}</td>
                <td className='px-6 py-4'>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className='text-red-600 hover:text-red-800 text-sm font-medium'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />
    </div>
  );
};

export default AdminProducts;
