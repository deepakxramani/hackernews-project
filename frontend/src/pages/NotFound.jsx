import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[calc(100vh-12rem)] page-enter px-4'>
      {/* Animated 404 */}
      <div className='relative mb-8'>
        <h1 className='text-[120px] sm:text-[160px] font-black gradient-text leading-none select-none'>
          404
        </h1>
        <div className='absolute inset-0 blur-3xl opacity-10 bg-gradient-to-r from-accent-orange to-accent-purple rounded-full' />
      </div>

      <div className='text-center'>
        <h2 className='text-xl sm:text-2xl font-bold text-text-primary mb-2'>
          Page not found
        </h2>
        <p className='text-text-muted text-sm sm:text-base mb-8 max-w-sm'>
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <Link
          to='/'
          className='inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-orange to-accent-amber text-dark-900 hover:shadow-[0_0_24px_rgba(255,107,53,0.4)] transition-all duration-300 hover:scale-105 active:scale-95'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
