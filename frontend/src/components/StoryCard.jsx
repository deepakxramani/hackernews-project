import API from '../api/axios';

const StoryCard = ({ story, refreshStories }) => {
  const handleBookmark = async () => {
    try {
      await API.post(`/stories/${story._id}/bookmark`);

      refreshStories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        marginBottom: '20px',
      }}
    >
      <a href={story.url} target='_blank'>
        <h3>{story.title}</h3>
      </a>

      <p>Points: {story.points}</p>

      <p>Author: {story.author}</p>

      <p>{story.postedAt}</p>

      <button onClick={handleBookmark}>Bookmark</button>
    </div>
  );
};

export default StoryCard;
