import cors from 'cors';

// CORS configuration
const corsConfig = cors({
  origin: ['http://127.0.0.1:8000', 'http://localhost:8001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'application/json'],
  credentials: true
});

export default corsConfig;