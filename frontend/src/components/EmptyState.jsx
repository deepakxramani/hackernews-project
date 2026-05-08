import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'Check back later for new content.',
  ctaText,
  ctaLink,
}) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 sm:py-24 animate-fade-in'>
      {/* Floating icon */}
      <div className='relative mb-6'>
        <span className='text-5xl sm:text-6xl block animate-float'>{icon}</span>
        {/* Subtle glow under icon */}
        <div className='absolute inset-0 blur-2xl opacity-20 bg-accent-orange rounded-full scale-150' />
      </div>

      <h3 className='text-lg sm:text-xl font-semibold text-text-primary mb-2'>
        {title}
      </h3>

      <p className='text-text-muted text-sm sm:text-base text-center max-w-xs'>
        {description}
      </p>

      {ctaText && ctaLink && (
        <Link
          to={ctaLink}
          className='mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-orange to-accent-amber text-dark-900 hover:shadow-[0_0_24px_rgba(255,107,53,0.4)] transition-all duration-300 hover:scale-105 active:scale-95'
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
