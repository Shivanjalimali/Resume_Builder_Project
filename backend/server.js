import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;




app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/resume', resumeRoutes);

// Static folder for uploads
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);


// Test route
app.get('/', (req, res) => {
  res.send('API working');
});


// ✅ START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
  }

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
