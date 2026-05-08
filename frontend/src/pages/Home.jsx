import { useEffect, useState, useCallback } from 'react';
import API from '../api/Api-service';
import StoryCard from '../components/StoryCard';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('points');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStories = useCallback(async () => {
    try {
      setError(null);
      const { data } = await API.get('/stories', {
        params: { page, limit: 10, search, sort },
      });
      setStories(data.stories);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      setError('Failed to load stories. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    setLoading(true);
    fetchStories();
  }, [fetchStories]);

  // Debounced search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await API.post('/scrape');
      toast.success('Stories refreshed!');
      await fetchStories();
    } catch {
      toast.error('Failed to refresh stories');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sortOptions = [
    { value: 'points', label: 'Top', icon: '🔥' },
    { value: 'newest', label: 'New', icon: '✨' },
    { value: 'oldest', label: 'Old', icon: '📜' },
  ];

  return (
    <div className='page-enter'>
      {/* Hero heading */}
      <div className='mb-8 sm:mb-10'>
        <div className='flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row'>
          <div>
            <h1
              className='text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight'
              style={{ margin: 20 }}
            >
              <span className='gradient-text'>Top Stories</span>{' '}
              <span className='text-xl sm:text-2xl md:text-3xl'>🔥</span>
            </h1>
            <p
              className='text-text-secondary mt-2 sm:mt-3 text-xs sm:text-sm md:text-base'
              style={{ margin: 20 }}
            >
              The latest and greatest from the Hacker News community
              {!loading && total > 0 && (
                <span className='text-text-muted ml-1'>
                  · {total} {total === 1 ? 'story' : 'stories'}
                </span>
              )}
            </p>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className='flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium glass hover:bg-white/8 transition-all duration-300 text-text-secondary hover:text-text-primary disabled:opacity-50 cursor-pointer active:scale-95 flex-shrink-0'
            aria-label='Refresh stories'
            style={{ padding: '8px 10px' }}
          >
            <svg
              className={`w-4 h-4 ${refreshing ? 'animate-spin-slow' : ''}`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div
        className='flex flex-col sm:flex-row gap-3 mb-8'
        style={{ marginBottom: 8, marginLeft: 20 }}
      >
        {/* Search */}
        <div
          className='relative flex-1'
          style={{
            display: 'flex',
            gap: 20,
          }}
        >
          <svg
            className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <input
            type='text'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder='Search stories...'
            className='w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-glass-border text-text-primary placeholder-text-muted text-sm outline-none transition-all duration-300 focus:border-accent-orange/50 focus:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] focus:bg-white/8'
            id='search-stories'
            style={{ paddingLeft: 35 }}
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer'
              aria-label='Clear search'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          )}
        </div>

        {/* Sort pills */}
        <div
          className='flex items-center gap-1 rounded-xl glass w-fit'
          style={{ padding: 10 }}
        >
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSort(opt.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                sort === opt.value
                  ? 'bg-accent-orange/15 text-accent-orange shadow-sm'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
              }`}
              style={{ padding: 5 }}
            >
              <span className='mr-1'>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stories list */}
      <div className='flex flex-col gap-4 sm:gap-5'>
        {loading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} delay={i * 100} />
            ))}
          </>
        ) : error ? (
          <div className='flex flex-col items-center justify-center py-16 sm:py-20 animate-fade-in'>
            <span className='text-4xl sm:text-5xl mb-4 block'>⚠️</span>
            <p className='text-text-secondary text-base sm:text-lg font-medium'>
              {error}
            </p>
            <button
              onClick={() => {
                setLoading(true);
                fetchStories();
              }}
              className='mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-accent-orange to-accent-amber text-dark-900 hover:shadow-[0_0_24px_rgba(255,107,53,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer'
            >
              Try Again
            </button>
          </div>
        ) : stories.length > 0 ? (
          stories.map((story, index) => (
            <div key={story._id} style={{ animationDelay: `${index * 60}ms` }}>
              <StoryCard
                story={story}
                refreshStories={fetchStories}
                rank={(page - 1) * 10 + index + 1}
              />
            </div>
          ))
        ) : (
          <EmptyState
            icon={search ? '🔍' : '📭'}
            title={search ? 'No results found' : 'No stories yet'}
            description={
              search
                ? `No stories match "${search}". Try a different search term.`
                : 'Check back later for new stories!'
            }
          />
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div
          className='flex items-center justify-center gap-2 mt-8 sm:mt-10'
          style={{ margin: '10px 0px' }}
        >
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className='px-4 py-2 rounded-xl text-sm font-medium glass hover:bg-white/8 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-text-secondary hover:text-text-primary active:scale-95'
            style={{ padding: 10 }}
          >
            ← Prev
          </button>

          <div className='flex items-center gap-1 px-3'>
            {/* Page numbers */}
            {(() => {
              const pages = [];
              const maxVisible = 5;
              let start = Math.max(1, page - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
              }

              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className='w-8 h-8 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer text-text-muted hover:text-text-primary hover:bg-white/5'
                  >
                    1
                  </button>,
                );
                if (start > 2) {
                  pages.push(
                    <span
                      key='start-dots'
                      className='text-text-muted text-xs px-1'
                    >
                      ...
                    </span>,
                  );
                }
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                      i === page
                        ? 'bg-accent-orange/15 text-accent-orange shadow-[0_0_8px_rgba(255,107,53,0.2)]'
                        : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    {i}
                  </button>,
                );
              }

              if (end < totalPages) {
                if (end < totalPages - 1) {
                  pages.push(
                    <span
                      key='end-dots'
                      className='text-text-muted text-xs px-1'
                    >
                      ...
                    </span>,
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className='w-8 h-8 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer text-text-muted hover:text-text-primary hover:bg-white/5'
                  >
                    {totalPages}
                  </button>,
                );
              }

              return pages;
            })()}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className='px-4 py-2 rounded-xl text-sm font-medium glass hover:bg-white/8 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-text-secondary hover:text-text-primary active:scale-95'
            style={{ padding: 10 }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
