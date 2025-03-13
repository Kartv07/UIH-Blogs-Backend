
import express from 'express';
import 'dotenv/config';
import ParentCategoryRoutes from "./routes/parent_category_routes.js";
import { connectMongodb } from './database/connectMongodb.js';
import CategoryRouter from './routes/category_routes.js';
import GeneralRouter from './routes/general_routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", // Allows all origins (Modify for security)
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // Change to `true` if using cookies/authentication headers
}));

await connectMongodb();

app.use(`/parent-category`, ParentCategoryRoutes);
app.use(`/category`, CategoryRouter);
app.use('/general', GeneralRouter);

const PORT = process?.env?.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is up !!!');
});

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});