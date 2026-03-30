import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder, clearOrder } from '../features/orders/orderSlice';
import Spinner from '../components/Spinner';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrder(id));
    return () => dispatch(clearOrder());
  }, [dispatch, id]);

  if (isLoading || !order) return <Spinner />;

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <Link
        to='/orders'
        className='text-primary-600 hover:underline text-sm mb-4 inline-block'
      >
        &larr; Back to Orders
      </Link>

      <h1 className='text-2xl font-bold text-gray-900'>
        Order #{order._id.slice(-8)}
      </h1>
      <p className='text-sm text-gray-500 mt-1'>
        Placed on {new Date(order.createdAt).toLocaleDateString()}
      </p>

      {/* Status */}
      <div className='mt-4'>
        <span className='px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800'>
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className='mt-8 bg-white rounded-xl shadow-sm p-6'>
        <h2 className='font-semibold text-lg mb-4'>Items</h2>
        <div className='divide-y'>
          {order.items.map((item, idx) => (
            <div key={idx} className='flex justify-between items-center py-3'>
              <div>
                <p className='font-medium'>{item.name}</p>
                <p className='text-sm text-gray-500'>Qty: {item.quantity}</p>
              </div>
              <p className='font-semibold'>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className='mt-6 bg-white rounded-xl shadow-sm p-6'>
        <h2 className='font-semibold text-lg mb-4'>Summary</h2>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Items Total</span>
            <span>${order.itemsTotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Shipping</span>
            <span>${order.shippingCost.toFixed(2)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-500'>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <hr />
          <div className='flex justify-between font-bold text-base'>
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className='mt-6 bg-white rounded-xl shadow-sm p-6'>
        <h2 className='font-semibold text-lg mb-2'>Shipping Address</h2>
        <p className='text-gray-600'>
          {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
          {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
          {order.shippingAddress.country}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
