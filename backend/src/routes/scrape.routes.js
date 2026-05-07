import express from 'express';
import { scrapeStories } from '../controllers/scrape.controller.js';

const router = express.Router();

router.post('/', scrapeStories);

export default router;
