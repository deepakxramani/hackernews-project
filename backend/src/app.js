import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import scrapeRoutes from './routes/scrape.routes.js';
import authRoutes from './routes/auth.routes.js';
import storyRoutes from './routes/story.routes.js';

const app = express();

app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS
app.set('trust proxy', 1);

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://hackernews-pro.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Too many auth attempts, please try again later.',
  },
});
app.use('/api/auth', authLimiter);

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));

// Routes
app.use('/api/scrape', scrapeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

export default app;
