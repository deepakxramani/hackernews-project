import scrapeHackerNews from '../services/scraper.service.js';

export const scrapeStories = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();

    res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
