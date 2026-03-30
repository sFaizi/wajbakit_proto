import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-16'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl'>
          Welcome to <span className='text-primary-600'>wajbakit_proto</span>
        </h1>
        <p className='mt-4 text-lg text-gray-600 max-w-2xl mx-auto'>
          Your one-stop shop for quality products. Browse our collection, place
          orders, and track deliveries.
        </p>
        <div className='mt-8 flex justify-center gap-4'>
          <Link to='/products'>
            <Button size='lg'>Browse Products</Button>
          </Link>
          <Link to='/signup'>
            <Button variant='outline' size='lg'>
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
