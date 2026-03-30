import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../features/orders/orderSlice';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import { useState } from 'react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading } = useSelector(
    (state) => state.orders,
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyOrders({ page, limit: 10 }));
  }, [dispatch, page]);

  if (isLoading) return <Spinner />;

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>My Orders</h1>

      {orders.length === 0 ? (
        <p className='text-center text-gray-500 py-12'>No orders yet.</p>
      ) : (
        <>
          <div className='space-y-4'>
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className='block bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='text-sm text-gray-500'>
                      Order #{order._id.slice(-8)}
                    </p>
                    <p className='font-semibold mt-1'>
                      {order.items.length} item
                      {order.items.length > 1 ? 's' : ''}
                    </p>
                    <p className='text-sm text-gray-500 mt-1'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className='text-right'>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <p className='text-lg font-bold text-gray-900 mt-2'>
                      ${order.totalAmount.toFixed(2)}
                    </p>
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

export default MyOrders;
