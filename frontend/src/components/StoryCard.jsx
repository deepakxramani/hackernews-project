import API from '../api/Api-service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

const StoryCard = ({ story, refreshStories, rank }) => {
  const { user } = useAuth();
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [optimisticBookmarked, setOptimisticBookmarked] = useState(null);

  const actualBookmarked = user && story.bookmarks?.includes(user.id);
  const isBookmarked =
    optimisticBookmarked !== null ? optimisticBookmarked : actualBookmarked;

  const handleBookmark = async () => {
    if (!user) {
      toast.error('Please login to bookmark stories');
      return;
    }

    if (isBookmarking) return;

    // Optimistic update
    setOptimisticBookmarked(!isBookmarked);
    setIsBookmarking(true);

    try {
      const { data } = await API.post(`/stories/${story._id}/bookmark`);
      toast.success(data.message);
      refreshStories();
    } catch (error) {
      // Revert optimistic update
      setOptimisticBookmarked(null);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsBookmarking(false);
      // Reset optimistic state after refresh
      setTimeout(() => setOptimisticBookmarked(null), 500);
    }
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return null;
    }
  };

  const domain = story.url ? getDomain(story.url) : null;

  return (
    <div
      className='stagger-item group glass rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:bg-glass-hover hover:shadow-[0_4px_30px_rgba(255,107,53,0.06)] hover:border-accent-orange/15 hover:-translate-y-0.5'
      style={{ padding: 10, margin: '4px 20px' }}
    >
      <div className='flex items-start gap-3.5 sm:gap-5'>
        {/* Rank number */}
        {rank !== undefined && (
          <div className='flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center'>
            <span className='text-xs sm:text-sm font-bold text-text-muted'>
              {rank}
            </span>
          </div>
        )}

        {/* Content */}
        <div className='flex-1 min-w-0'>
          {/* Title */}
          <a
            href={story.url || '#'}
            target={story.url ? '_blank' : '_self'}
            rel='noopener noreferrer'
            className='group/link block'
          >
            <h3 className='text-sm sm:text-base font-semibold text-text-primary group-hover/link:text-accent-orange transition-colors duration-300 leading-snug break-words'>
              {story.title}
              {story.url && (
                <svg
                  className='inline-block w-3 h-3 ml-1.5 opacity-0 group-hover/link:opacity-100 transition-all duration-300 -translate-y-0.5 text-text-muted'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                  />
                </svg>
              )}
            </h3>
          </a>

          {/* URL domain */}
          {domain && (
            <p className='text-[11px] sm:text-xs text-text-muted mt-1.5 truncate max-w-[280px] sm:max-w-none flex items-center gap-1'>
              <svg
                className='w-3 h-3 flex-shrink-0'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                />
              </svg>
              {domain}
            </p>
          )}

          {/* Meta row */}
          <div className='flex flex-wrap items-center gap-2.5 sm:gap-3.5 mt-3 sm:mt-4'>
            {/* Points badge */}
            <span className='inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-accent-orange/10 text-accent-orange text-[11px] sm:text-xs font-semibold'>
              <svg className='w-3 h-3' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M12 4l2.5 5 5.5.8-4 3.9.9 5.5L12 16.3l-4.9 2.9.9-5.5-4-3.9 5.5-.8z' />
              </svg>
              {story.points ?? 0}
            </span>

            {/* Author */}
            {story.author && (
              <span className='inline-flex items-center gap-1 text-[11px] sm:text-xs text-text-secondary'>
                <svg
                  className='w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-muted flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <span className='truncate max-w-[100px] sm:max-w-none'>
                  {story.author}
                </span>
              </span>
            )}

            {/* Comments */}
            {story.comments > 0 && (
              <span className='inline-flex items-center gap-1 text-[11px] sm:text-xs text-text-muted'>
                <svg
                  className='w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
                {story.comments}
              </span>
            )}

            {/* Time */}
            {story.postedAt && (
              <span className='inline-flex items-center gap-1 text-[11px] sm:text-xs text-text-muted'>
                <svg
                  className='w-3 h-3 flex-shrink-0'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                {story.postedAt}
              </span>
            )}
          </div>
        </div>

        {/* Bookmark button */}
        <button
          onClick={handleBookmark}
          disabled={isBookmarking}
          className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isBookmarked
              ? 'bg-accent-violet/15 text-accent-purple shadow-[0_0_12px_rgba(168,85,247,0.2)] bookmark-pop'
              : 'bg-white/5 text-text-muted hover:bg-accent-violet/10 hover:text-accent-purple'
          } hover:scale-110 active:scale-95 disabled:opacity-50`}
          data-tooltip={isBookmarked ? 'Remove bookmark' : 'Bookmark story'}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this story'}
        >
          <svg
            className='w-4 h-4 sm:w-5 sm:h-5'
            fill={isBookmarked ? 'currentColor' : 'none'}
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
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
