import axios from 'axios';
import * as cheerio from 'cheerio';
import Story from '../models/Story.js';

const scrapeHackerNews = async () => {
  try {
    console.log(`[Scraper] Starting scrape at ${new Date().toISOString()}`);

    const { data } = await axios.get('https://news.ycombinator.com', {
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    const stories = [];

    $('.athing').each((index, element) => {
      if (index >= 10) return false;

      const title = $(element).find('.titleline > a').first().text();

      const url = $(element).find('.titleline > a').first().attr('href');

      const subtext = $(element).next();

      const pointsText = subtext.find('.score').text();

      const points = parseInt(pointsText) || 0;

      const author = subtext.find('.hnuser').text();

      const postedAt = subtext.find('.age').text();

      // Scrape comments count
      const subtextLinks = subtext.find('a');
      let comments = 0;
      subtextLinks.each((_, link) => {
        const text = $(link).text();
        const match = text.match(/(\d+)\s*comment/);
        if (match) {
          comments = parseInt(match[1]) || 0;
        }
      });

      stories.push({
        title,
        url,
        points,
        author,
        postedAt,
        comments,
      });
    });

    for (const story of stories) {
      await Story.findOneAndUpdate({ title: story.title }, story, {
        upsert: true,
        returnDocument: 'after',
      });
    }

    console.log(
      `[Scraper] Successfully scraped ${stories.length} stories at ${new Date().toISOString()}`,
    );

    return stories;
  } catch (error) {
    console.error(`[Scraper] Error: ${error.message}`);
    throw error;
  }
};

export default scrapeHackerNews;
