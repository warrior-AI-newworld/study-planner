import Task, { TASK_CATEGORIES, TASK_PRIORITIES } from '../models/Task.js';
import mongoose from 'mongoose';

export async function getTasks(request, response, next) {
  try {
    const filters = {};
    const { completed, category, priority } = request.query;

    if (completed !== undefined) {
      if (completed !== 'true' && completed !== 'false') {
        return response.status(400).json({
          success: false,
          error: { message: 'The completed filter must be true or false.' },
        });
      }
      filters.completed = completed === 'true';
    }

    if (category !== undefined) {
      if (!TASK_CATEGORIES.includes(category)) {
        return response.status(400).json({
          success: false,
          error: { message: 'Invalid category filter.' },
        });
      }
      filters.category = category;
    }

    if (priority !== undefined) {
      if (!TASK_PRIORITIES.includes(priority)) {
        return response.status(400).json({
          success: false,
          error: { message: 'Invalid priority filter.' },
        });
      }
      filters.priority = priority;
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    return response.status(200).json({ success: true, data: { tasks } });
  } catch (error) {
    return next(error);
  }
}

export async function createTask(request, response, next) {
  try {
    const { title, category, priority } = request.body;

    if (typeof title !== 'string' || title.trim().length === 0) {
      return response.status(400).json({
        success: false,
        error: { message: 'Task title is required.' },
      });
    }

    if (title.trim().length > 200) {
      return response.status(400).json({
        success: false,
        error: { message: 'Task title cannot exceed 200 characters.' },
      });
    }

    if (!TASK_CATEGORIES.includes(category)) {
      return response.status(400).json({
        success: false,
        error: { message: 'A valid task category is required.' },
      });
    }

    if (!TASK_PRIORITIES.includes(priority)) {
      return response.status(400).json({
        success: false,
        error: { message: 'A valid task priority is required.' },
      });
    }

    const task = await Task.create({ title: title.trim(), category, priority });
    return response.status(201).json({ success: true, data: { task } });
  } catch (error) {
    return next(error);
  }
}

export async function updateTask(request, response, next) {
  try {
    const { id } = request.params;
    const { completed } = request.body ?? {};

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({
        success: false,
        error: { message: 'Invalid task ID.' },
      });
    }

    if (typeof completed !== 'boolean') {
      return response.status(400).json({
        success: false,
        error: { message: 'The completed field must be true or false.' },
      });
    }

    const task = await Task.findByIdAndUpdate(id, { completed }, { new: true, runValidators: true });
    if (!task) {
      return response.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    return response.status(200).json({ success: true, data: { task } });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTask(request, response, next) {
  try {
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      return response.status(400).json({
        success: false,
        error: { message: 'Invalid task ID.' },
      });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return response.status(404).json({
        success: false,
        error: { message: 'Task not found.' },
      });
    }

    return response.status(200).json({ success: true, data: { task } });
  } catch (error) {
    return next(error);
  }
}
