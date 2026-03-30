import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllOrders,
  updateOrderStatus,
} from '../../features/orders/orderSlice';
import Spinner from '../../components/Spinner';
import Pagination from '../../components/Pagination';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, pagination, isLoading } = useSelector(
    (state) => state.orders,
  );
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllOrders({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleStatusChange = async (orderId, status) => {
    const result = await dispatch(updateOrderStatus({ id: orderId, status }));
    if (updateOrderStatus.fulfilled.match(result)) {
      toast.success('Status updated');
    } else {
      toast.error(result.payload || 'Failed to update');
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>All Orders</h1>

      {orders.length === 0 ? (
        <p className='text-center text-gray-500 py-12'>No orders yet.</p>
      ) : (
        <>
          <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 text-left'>
                <tr>
                  <th className='px-6 py-3 font-medium text-gray-500'>Order</th>
                  <th className='px-6 py-3 font-medium text-gray-500'>
                    Customer
                  </th>
                  <th className='px-6 py-3 font-medium text-gray-500'>Items</th>
                  <th className='px-6 py-3 font-medium text-gray-500'>Total</th>
                  <th className='px-6 py-3 font-medium text-gray-500'>
                    Status
                  </th>
                  <th className='px-6 py-3 font-medium text-gray-500'>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                {orders.map((order) => (
                  <tr key={order._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 font-mono text-xs'>
                      #{order._id.slice(-8)}
                    </td>
                    <td className='px-6 py-4'>{order.user?.name || 'N/A'}</td>
                    <td className='px-6 py-4'>{order.items.length}</td>
                    <td className='px-6 py-4 font-medium'>
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={['cancelled', 'delivered'].includes(
                          order.status,
                        )}
                        className='text-sm border rounded px-2 py-1 disabled:opacity-50'
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default AdminOrders;
