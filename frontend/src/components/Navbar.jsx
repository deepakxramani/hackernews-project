import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Scroll-aware backdrop
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Keyboard accessibility — Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !hamburgerRef.current?.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  const navLinkClass = (path) =>
    `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      isActive(path)
        ? 'bg-accent-orange/15 text-accent-orange shadow-[0_0_12px_rgba(255,107,53,0.2)]'
        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-dark-900/80 backdrop-blur-xl border-glass-border shadow-lg shadow-dark-900/50'
          : 'glass border-glass-border'
      }`}
    >
      <div className='w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10'>
        <div className='flex items-center justify-between h-16 sm:h-18'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2 group flex-shrink-0'>
            <span className='text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300'>
              🔥
            </span>
            <span className='text-base sm:text-lg font-bold gradient-text tracking-tight'>
              HackerNews
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className='desktop-nav items-center gap-2'>
            <Link
              to='/'
              className={navLinkClass('/')}
              style={{ padding: 10, borderRadius: 10 }}
            >
              Home
            </Link>

            {user && (
              <Link
                to='/bookmarks'
                className={navLinkClass('/bookmarks')}
                style={{ padding: 10, borderRadius: 10 }}
              >
                <span className='flex items-center gap-1.5'>
                  <svg
                    className='w-3.5 h-3.5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                    />
                  </svg>
                  Bookmarks
                </span>
              </Link>
            )}

            {!user ? (
              <div className='flex items-center gap-2 ml-4'>
                <Link
                  to='/login'
                  className='px-4 py-2 rounded text-sm font-medium text-text-secondary hover:text-text-primary transition-all duration-300 hover:bg-white/5'
                  style={{ padding: 10, borderRadius: 10 }}
                >
                  Login
                </Link>
                <Link
                  to='/register'
                  className='px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-accent-orange to-accent-amber text-dark-900 hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all duration-300 hover:scale-105 active:scale-95'
                  style={{ padding: 10, borderRadius: 10 }}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className='flex items-center gap-3 ml-4'>
                <div className='flex items-center gap-2'>
                  <div className='w-8 h-8 rounded-full bg-gradient-to-br from-accent-violet to-accent-purple flex items-center justify-center text-xs font-bold text-white uppercase flex-shrink-0 ring-2 ring-accent-violet/20'>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className='text-sm text-text-secondary font-medium hidden lg:inline'>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className='px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 cursor-pointer'
                  style={{ padding: 10, borderRadius: 10 }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            ref={hamburgerRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className='mobile-hamburger flex-col gap-1.5 p-2 cursor-pointer'
            aria-label='Toggle menu'
            aria-expanded={mobileOpen}
          >
            <span
              className={`block w-5 h-0.5 bg-text-secondary transition-all duration-300 origin-center ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-text-secondary transition-all duration-300 ${
                mobileOpen ? 'opacity-0 scale-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-text-secondary transition-all duration-300 origin-center ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`mobile-menu overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen
              ? 'max-h-[400px] opacity-100 pb-4 pt-2'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className='border-t border-glass-border pt-3'>
            <div className='flex flex-col gap-2'>
              <Link
                to='/'
                onClick={() => setMobileOpen(false)}
                className={`${navLinkClass('/')} block w-full`}
              >
                Home
              </Link>

              {user && (
                <Link
                  to='/bookmarks'
                  onClick={() => setMobileOpen(false)}
                  className={`${navLinkClass('/bookmarks')} block w-full`}
                >
                  <span className='flex items-center gap-1.5'>
                    <svg
                      className='w-3.5 h-3.5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'
                      />
                    </svg>
                    Bookmarks
                  </span>
                </Link>
              )}

              {!user ? (
                <div className='flex flex-col gap-2 mt-2'>
                  <Link
                    to='/login'
                    onClick={() => setMobileOpen(false)}
                    className='px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors text-center hover:bg-white/5'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    onClick={() => setMobileOpen(false)}
                    className='px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-orange to-accent-amber text-dark-900 text-center hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] transition-all duration-300'
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className='flex items-center justify-between mt-2 pt-2 border-t border-glass-border'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-full bg-gradient-to-br from-accent-violet to-accent-purple flex items-center justify-center text-xs font-bold text-white uppercase ring-2 ring-accent-violet/20'>
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <span className='text-sm text-text-secondary font-medium'>
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className='px-4 py-2 rounded-xl text-sm text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
