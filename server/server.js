import express from 'express';
import cookieParser from 'cookie-parser';

import dotenv from './config/dotenv.js';
import connectDB from './config/database.js';
import corsConfig from './config/corsConfig.js';
import adminRoutes from './routes/adminRoute.js';
import studentRoutes from './routes/studentRoute.js';
import errorHandler from "./middlewares/errorHandler.js";

import taskUpdater from "./cron-jobs/taskStatus.js"

dotenv.config();
connectDB();

const app = express();

//CORS
app.use(corsConfig);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;

app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Error handling middleware
app.use(errorHandler)

app.get('/', (req, res) => res.send("server is ready"))

app.listen(port, () => {
  console.log(`Server listening http://127.0.0.1:${port}`);
});