const Footer = () => {
  return (
    <footer className='relative z-10 mt-auto'>
      <div className='glass border-t border-glass-border'>
        <div className='w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-6 sm:py-8'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            {/* Left: Attribution */}
            <div className='flex items-center gap-2 text-xs sm:text-sm text-text-muted'>
              <span className='text-base'>🔥</span>
              <span>
                Powered by{' '}
                <a
                  href='https://news.ycombinator.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-accent-orange hover:text-accent-amber transition-colors font-medium'
                >
                  Hacker News
                </a>
              </span>
            </div>

            {/* Center: Divider on desktop */}
            <div className='hidden sm:block w-px h-4 bg-glass-border' />

            {/* Right: Credits */}
            <div className='flex items-center gap-3 text-xs text-text-muted'>
              <span>
                Built by{' '}
                <span className='text-text-secondary font-medium'>
                  Deepak Ramani
                </span>
              </span>
              <span className='text-glass-border'>•</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
