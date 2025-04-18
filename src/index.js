import express from 'express';
import 'dotenv/config';
import cors from 'cors';

import ParentCategoryRoutes from './routes/parent_category_routes.js';
import CategoryRouter from './routes/category_routes.js';
import GeneralRouter from './routes/general_routes.js';
import YoutubeRouter from './routes/youtube_routes.js';
import { connectMongodb } from './database/connectMongodb.js';

const app = express();

app.use(express.json());

const allowedOrigins = [
  'https://until-its-happen.vercel.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: ['https://until-its-happen.vercel.app', 'http://localhost:3000'], // your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));



await connectMongodb();

app.use('/parent-category', ParentCategoryRoutes);
app.use('/category', CategoryRouter);
app.use('/general', GeneralRouter);
app.use('/youtube', YoutubeRouter);

app.get('/', (req, res) => {
  res.send('Backend is up !!!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err instanceof Error && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS Error: Origin not allowed' });
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
