import { useEffect, useState } from 'react';
import API from '../api/Api-service';
import StoryCard from '../components/StoryCard';

const Home = () => {
  const [stories, setStories] = useState([]);

  const fetchStories = async () => {
    try {
      const { data } = await API.get('/stories');

      setStories(data.stories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Top Stories</h1>

      {stories.map((story) => (
        <StoryCard
          key={story._id}
          story={story}
          refreshStories={fetchStories}
        />
      ))}
    </div>
  );
};

export default Home;
