import { Router } from 'express';
import { createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';

const taskRouter = Router();

taskRouter.get('/', getTasks);
taskRouter.post('/', createTask);
taskRouter.patch('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);

export default taskRouter;
