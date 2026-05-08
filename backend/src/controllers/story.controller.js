import Story from '../models/Story.js';

export const getStories = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || '';
    const sort = req.query.sort || 'points';

    // Build query filter
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'points':
      default:
        sortOptions = { points: -1 };
        break;
    }

    const stories = await Story.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Story.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stories. Please try again.',
    });
  }
};

export const getSingleStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    res.status(200).json({
      success: true,
      story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story. Please try again.',
    });
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
      });
    }

    const userId = req.user._id;

    const alreadyBookmarked = story.bookmarks.includes(userId);

    if (alreadyBookmarked) {
      story.bookmarks = story.bookmarks.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      story.bookmarks.push(userId);
    }

    await story.save();

    res.status(200).json({
      success: true,
      message: alreadyBookmarked ? 'Bookmark removed' : 'Bookmark added',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update bookmark. Please try again.',
    });
  }
};

export const getBookmarkedStories = async (req, res) => {
  try {
    const stories = await Story.find({
      bookmarks: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      stories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookmarks. Please try again.',
    });
  }
};
