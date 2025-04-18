
import express from 'express';
import 'dotenv/config';
import ParentCategoryRoutes from "./routes/parent_category_routes.js";
import { connectMongodb } from './database/connectMongodb.js';
import CategoryRouter from './routes/category_routes.js';
import GeneralRouter from './routes/general_routes.js';
import YoutubeRouter from './routes/youtube_routes.js'
import cors from 'cors';

const app = express();

app.use(express.json());

const allowedOrigins = [
'  https://until-its-happen.vercel.app',
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // If using cookies/authentication
  })
);

await connectMongodb();

app.use(`/parent-category`, ParentCategoryRoutes);
app.use(`/category`, CategoryRouter);
app.use('/general', GeneralRouter);
app.use('/youtube', YoutubeRouter);

const PORT = process?.env?.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is up !!!');
});

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});