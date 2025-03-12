
import express from 'express';
import 'dotenv/config';
import parentCategoryRoutes from "./routes/parent_category_routes.js";

const app = express();

app.use(express.json());

app.use(`/parent-category`, parentCategoryRoutes);

const PORT = process?.env?.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is up !!!');
});

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});