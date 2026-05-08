import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import API from '../api/Api-service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to='/' />;

  const getPasswordStrength = (pw) => {
    if (!pw) return { score: 0, label: '', color: '' };
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { score: 20, label: 'Weak', color: 'bg-red-500' };
    if (s <= 2) return { score: 40, label: 'Fair', color: 'bg-orange-500' };
    if (s <= 3) return { score: 60, label: 'Good', color: 'bg-yellow-500' };
    if (s <= 4) return { score: 80, label: 'Strong', color: 'bg-emerald-400' };
    return { score: 100, label: 'Excellent', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
      const { data } = await API.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });
      login(data);
      toast.success('Account created! Welcome! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-300 focus:bg-white/8 ${
      errors[field] ? 'border-red-500/50 focus:border-red-500/80 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-glass-border focus:border-accent-violet/50 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]'
    }`;

  return (
    <div className='flex items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-12rem)] page-enter px-1'>
      <div className='w-full max-w-sm sm:max-w-md'>
        <div className='text-center mb-8 sm:mb-10'>
          <span className='text-3xl sm:text-4xl mb-3 block'>🚀</span>
          <h1 className='text-xl sm:text-2xl md:text-3xl font-bold gradient-text'>Create Account</h1>
          <p className='text-text-secondary mt-2 text-xs sm:text-sm'>Join the community and start bookmarking</p>
        </div>

        <div className='glass rounded-2xl p-6 sm:p-10'>
          <form onSubmit={handleSubmit} className='space-y-5 sm:space-y-6'>
            <div>
              <label htmlFor='register-name' className='block text-xs sm:text-sm font-medium text-text-secondary mb-2'>Full Name</label>
              <input id='register-name' type='text' name='name' value={formData.name} placeholder='John Doe' onChange={handleChange} className={inputClass('name')} />
              {errors.name && <p className='text-red-400 text-xs mt-1'>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor='register-email' className='block text-xs sm:text-sm font-medium text-text-secondary mb-2'>Email</label>
              <input id='register-email' type='email' name='email' value={formData.email} placeholder='you@example.com' onChange={handleChange} className={inputClass('email')} />
              {errors.email && <p className='text-red-400 text-xs mt-1'>{errors.email}</p>}
            </div>
            <div>
              <label htmlFor='register-password' className='block text-xs sm:text-sm font-medium text-text-secondary mb-2'>Password</label>
              <div className='relative'>
                <input id='register-password' type={showPassword ? 'text' : 'password'} name='password' value={formData.password} placeholder='••••••••' onChange={handleChange} className={inputClass('password')} />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer' aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' /></svg>
                  ) : (
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className='text-red-400 text-xs mt-1'>{errors.password}</p>}
              {formData.password && (
                <div className='mt-2'>
                  <div className='flex items-center gap-2'>
                    <div className='flex-1 h-1 rounded-full bg-dark-600 overflow-hidden'>
                      <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${strength.score}%` }} />
                    </div>
                    <span className='text-[10px] text-text-muted font-medium'>{strength.label}</span>
                  </div>
                  <p className='text-[10px] text-text-muted mt-1'>Use 8+ chars with uppercase, numbers & symbols</p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor='register-confirm' className='block text-xs sm:text-sm font-medium text-text-secondary mb-2'>Confirm Password</label>
              <input id='register-confirm' type='password' name='confirmPassword' value={formData.confirmPassword} placeholder='••••••••' onChange={handleChange} className={inputClass('confirmPassword')} />
              {errors.confirmPassword && <p className='text-red-400 text-xs mt-1'>{errors.confirmPassword}</p>}
            </div>
            <button type='submit' disabled={loading} className='w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-accent-violet to-accent-purple text-white hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2'>
              {loading && <span className='spinner' />}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className='text-center text-xs sm:text-sm text-text-muted mt-6 sm:mt-8'>
            Already have an account?{' '}
            <Link to='/login' className='text-accent-violet hover:text-accent-purple transition-colors font-medium'>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
