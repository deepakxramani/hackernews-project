import { useEffect, useState, useCallback } from 'react';
import API from '../api/Api-service';
import StoryCard from '../components/StoryCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const Bookmarks = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchBookmarks = useCallback(async () => {
    try {
      setError(null);
      const { data } = await API.get('/stories/bookmarks');
      setStories(data.stories);
    } catch (err) {
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const filteredStories = stories.filter((s) =>
    s.title.toLowerCase().includes(searchInput.toLowerCase()),
  );

  return (
    <div className='page-enter'>
      <div className='mb-8 sm:mb-10'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight'>
          <span className='gradient-text'>Your Bookmarks</span>{' '}
          <span className='text-xl sm:text-2xl md:text-3xl'>🔖</span>
        </h1>
        <p className='text-text-secondary mt-2 sm:mt-3 text-xs sm:text-sm md:text-base'>
          Stories you&apos;ve saved for later
          {!loading && stories.length > 0 && (
            <span className='text-text-muted ml-1'>· {stories.length} saved</span>
          )}
        </p>
      </div>

      {!loading && stories.length > 0 && (
        <div className='relative mb-8'>
          <svg className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
          <input type='text' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder='Search bookmarks...' className='w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-300 focus:border-accent-violet/50 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] focus:bg-white/8' id='search-bookmarks' />
          {searchInput && (
            <button onClick={() => setSearchInput('')} className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer' aria-label='Clear search'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>
            </button>
          )}
        </div>
      )}

      <div className='flex flex-col gap-4 sm:gap-5'>
        {loading ? (
          <>{[...Array(3)].map((_, i) => <SkeletonCard key={i} delay={i * 100} />)}</>
        ) : error ? (
          <div className='flex flex-col items-center justify-center py-16 animate-fade-in'>
            <span className='text-5xl mb-4 block'>⚠️</span>
            <p className='text-text-secondary text-lg font-medium'>{error}</p>
            <button onClick={() => { setLoading(true); fetchBookmarks(); }} className='mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-violet to-accent-purple text-white hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer'>Try Again</button>
          </div>
        ) : filteredStories.length > 0 ? (
          filteredStories.map((story, i) => (
            <div key={story._id} style={{ animationDelay: `${i * 60}ms` }}>
              <StoryCard story={story} refreshStories={fetchBookmarks} rank={i + 1} />
            </div>
          ))
        ) : stories.length > 0 && searchInput ? (
          <EmptyState icon='🔍' title='No results found' description={`No bookmarks match "${searchInput}".`} />
        ) : (
          <EmptyState icon='🔖' title='No bookmarks yet' description='Go explore and save some stories you love!' ctaText='Explore Stories' ctaLink='/' />
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
