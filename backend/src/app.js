import express from 'express';
import cors from 'cors';
import scrapeRoutes from './routes/scrape.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/scrape', scrapeRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

export default app;
