import { useEffect, useState } from 'react';

import API from '../api/axios';

import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const [stories, setStories] = useState([]);

  const fetchBookmarks = async () => {
    try {
      const { data } = await API.get('/stories/bookmarks');

      setStories(data.stories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bookmarked Stories</h1>

      {stories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          refreshStories={fetchBookmarks}
        />
      ))}
    </div>
  );
};

export default Bookmarks;
