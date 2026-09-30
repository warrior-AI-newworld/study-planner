import Task, { TASK_CATEGORIES, TASK_PRIORITIES } from '../models/Task.js';
import mongoose from 'mongoose';
import { getUtcDayRange, isDateOnly } from '../utils/dateOnly.js';

export async function getTasks(request, response, next) {
  try {
    const filters = {};
    const { completed, category, priority, date } = request.query;

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

    if (date !== undefined) {
      if (!isDateOnly(date)) {
        return response.status(400).json({
          success: false,
          error: { message: 'The date filter must be a valid date in YYYY-MM-DD format.' },
        });
      }

      const { start, end } = getUtcDayRange(date);
      filters.$or = [
        { date },
        { date: { $exists: false }, createdAt: { $gte: start, $lt: end } },
      ];
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    const normalizedTasks = tasks.map((task) => {
      const taskData = task.toObject();
      return {
        ...taskData,
        date: taskData.date ?? taskData.createdAt.toISOString().slice(0, 10),
      };
    });
    return response.status(200).json({ success: true, data: { tasks: normalizedTasks } });
  } catch (error) {
    return next(error);
  }
}

export async function createTask(request, response, next) {
  try {
    const { title, category, priority, date } = request.body ?? {};

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

    if (!isDateOnly(date)) {
      return response.status(400).json({
        success: false,
        error: { message: 'A valid task date in YYYY-MM-DD format is required.' },
      });
    }

    const task = await Task.create({ title: title.trim(), category, priority, date });
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
