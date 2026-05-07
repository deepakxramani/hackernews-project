import express from 'express';

import {
  getStories,
  getSingleStory,
  toggleBookmark,
  getBookmarkedStories,
} from '../controllers/story.controller.js';

import protect from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getStories);

router.get('/bookmarks', protect, getBookmarkedStories);

router.get('/:id', getSingleStory);

router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
