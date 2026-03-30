import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { signup, clearError } from '../features/auth/authSlice';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { isLoading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(signup(formData));
    if (signup.fulfilled.match(result)) {
      toast.success('Account created!');
      navigate('/');
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center px-4'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold text-center text-gray-900 mb-6'>
          Create Account
        </h2>

        {error && (
          <div className='bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label='Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Your name'
            required
          />
          <Input
            label='Email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='you@example.com'
            required
          />
          <Input
            label='Password'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Minimum 6 characters'
            required
          />
          <Button type='submit' className='w-full' isLoading={isLoading}>
            Sign Up
          </Button>
        </form>

        <p className='mt-4 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='text-primary-600 hover:underline font-medium'
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
