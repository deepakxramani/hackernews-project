import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import API from '../api/Api-service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  // Redirect logged-in users
  if (user) return <Navigate to='/' />;

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', formData);
      login(data);
      toast.success('Welcome back! 👋');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-300 focus:bg-white/8 ${
      errors[field] ? 'border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-glass-border focus:border-accent-orange/50 focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)]'
    }`;

  return (
    <div className='flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-12rem)] page-enter px-1'>
      <div className='w-full max-w-sm sm:max-w-md'>
        <div className='text-center mb-8 sm:mb-10'>
          <span className='text-3xl sm:text-4xl mb-3 block'>👋</span>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold gradient-text'>Welcome Back</h1>
          <p className='text-text-secondary mt-2 text-xs sm:text-sm'>Sign in to your account to continue</p>
        </div>

        <div className='glass rounded-2xl p-6 sm:p-10'>
          <form onSubmit={handleSubmit} className='space-y-5 sm:space-y-6'>
            <div>
              <label htmlFor='login-email' className='block text-xs sm:text-sm font-medium text-text-secondary mb-2'>Email</label>
              <input id='login-email' type='email' name='email' value={formData.email} placeholder='you@example.com' onChange={handleChange} className={inputClass('email')} />
              {errors.email && <p className='text-red-400 text-xs mt-1'>{errors.email}</p>}
            </div>
            <div>
              <label htmlFor='login-password' className='block text-xs sm:text-sm font-medium text-text-secondary mb-2'>Password</label>
              <div className='relative'>
                <input id='login-password' type={showPassword ? 'text' : 'password'} name='password' value={formData.password} placeholder='••••••••' onChange={handleChange} className={inputClass('password')} />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer' aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' /></svg>
                  ) : (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className='text-red-400 text-xs mt-1'>{errors.password}</p>}
            </div>
            <button type='submit' disabled={loading} className='w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-accent-orange to-accent-amber text-dark-900 hover:shadow-[0_0_24px_rgba(255,107,53,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2'>
              {loading && <span className='spinner border-dark-900/30 border-t-dark-900' />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className='text-center text-xs sm:text-sm text-text-muted mt-6 sm:mt-8'>
            Don&apos;t have an account?{' '}
            <Link to='/register' className='text-accent-orange hover:text-accent-amber transition-colors font-medium'>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
