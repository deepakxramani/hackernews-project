import dotenv from 'dotenv';
dotenv.config();

import cron from 'node-cron';
import scrapeHackerNews from './services/scraper.service.js';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Initial scrape on boot
  await scrapeHackerNews();

  // Scrape every 15 minutes automatically
  cron.schedule('*/15 * * * *', async () => {
    console.log('[Cron] Scheduled scrape triggered');
    try {
      await scrapeHackerNews();
    } catch (error) {
      console.error('[Cron] Scrape failed:', error.message);
    }
  });

  console.log('[Cron] Scheduled scraping every 15 minutes');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
