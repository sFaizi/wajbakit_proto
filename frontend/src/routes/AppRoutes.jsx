import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute, GuestRoute } from './Guards';
import Spinner from '../components/Spinner';

// Lazy-loaded pages
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const ProductList = lazy(() => import('../pages/ProductList'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const MyOrders = lazy(() => import('../pages/MyOrders'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Spinner size='lg' />}>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<ProductList />} />
        <Route path='/products/:id' element={<ProductDetail />} />

        {/* Guest-only routes (redirect if logged in) */}
        <Route element={<GuestRoute />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Route>

        {/* Protected routes (require auth) */}
        <Route element={<ProtectedRoute />}>
          <Route path='/orders' element={<MyOrders />} />
          <Route path='/orders/:id' element={<OrderDetail />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/admin/products' element={<AdminProducts />} />
          <Route path='/admin/orders' element={<AdminOrders />} />
        </Route>

        {/* 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
