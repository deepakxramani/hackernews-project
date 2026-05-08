const SkeletonCard = ({ delay = 0 }) => (
  <div
    className='glass rounded-2xl p-5 sm:p-6'
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className='flex items-start gap-3.5 sm:gap-5'>
      {/* Rank skeleton */}
      <div className='skeleton w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex-shrink-0' />

      <div className='flex-1 min-w-0'>
        {/* Title lines */}
        <div className='skeleton h-4 sm:h-5 w-full mb-2' />
        <div className='skeleton h-4 sm:h-5 w-3/4 mb-3' />

        {/* URL */}
        <div className='skeleton h-3 w-1/3 mb-5' />

        {/* Meta row */}
        <div className='flex gap-2.5 sm:gap-3.5'>
          <div className='skeleton h-5 sm:h-6 w-14 sm:w-16 rounded-full' />
          <div className='skeleton h-5 sm:h-6 w-20 sm:w-24 rounded-full' />
          <div className='skeleton h-5 sm:h-6 w-16 sm:w-20 rounded-full' />
        </div>
      </div>

      {/* Bookmark skeleton */}
      <div className='skeleton w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0' />
    </div>
  </div>
);

export default SkeletonCard;
