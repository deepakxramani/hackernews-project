import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../models/Story.js';

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com');

    const $ = cheerio.load(data);

    const stories = [];

    $('.athing').each((index, element) => {
      if (index >= 10) return false;

      const title = $(element).find('.titleline a').text();

      const url = $(element).find('.titleline a').attr('href');

      const subtext = $(element).next();

      const pointsText = subtext.find('.score').text();

      const points = parseInt(pointsText) || 0;

      const author = subtext.find('.hnuser').text();

      const postedAt = subtext.find('.age').text();

      stories.push({
        title,
        url,
        points,
        author,
        postedAt,
      });
    });

    for (const story of stories) {
      await Story.findOneAndUpdate({ title: story.title }, story, {
        upsert: true,
        returnDocument: 'after',
      });
    }

    console.log('Stories scraped successfully');

    return stories;
  } catch (error) {
    console.log(error.message);
  }
};

export default scrapeHackerNews;
