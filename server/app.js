import express from 'express';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import taskRouter from './routes/taskRoutes.js';

const app = express();
const configuredOrigins = (process.env.CLIENT_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const localOrigins = process.env.NODE_ENV === 'production'
  ? []
  : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];
const allowedOrigins = new Set([...configuredOrigins, ...localOrigins]);

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
}));
app.use(express.json());
app.get('/api/health', (request, response) => {
  response.status(200).json({ success: true, data: { status: 'ok' } });
});
app.use('/api/tasks', taskRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;