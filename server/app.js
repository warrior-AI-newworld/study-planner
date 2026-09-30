import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import taskRouter from './routes/taskRoutes.js';

const app = express();
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientBuildDirectory = path.resolve(serverDirectory, '../client/dist');
const clientEntryPoint = path.join(clientBuildDirectory, 'index.html');
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

if (existsSync(clientEntryPoint)) {
  app.use(express.static(clientBuildDirectory));
  app.get('/{*splat}', (request, response, next) => {
    if (request.path === '/api' || request.path.startsWith('/api/')) {
      return next();
    }

    if (path.extname(request.path)) {
      return next();
    }

    return response.sendFile(clientEntryPoint, (error) => {
      if (error) next(error);
    });
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;