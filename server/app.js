import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import taskRouter from './routes/taskRoutes.js';

const app = express();

app.use(express.json());
app.get('/api/health', (request, response) => {
  response.status(200).json({ success: true, data: { status: 'ok' } });
});
app.use('/api/tasks', taskRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;