import mongoose from 'mongoose';

export const TASK_CATEGORIES = ['Study', 'Work', 'Personal', 'Project', 'Other'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];
export const MAX_TITLE_LENGTH = 200;

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true,
      maxlength: [MAX_TITLE_LENGTH, `Task title cannot exceed ${MAX_TITLE_LENGTH} characters.`],
    },
    category: {
      type: String,
      required: [true, 'Task category is required.'],
      enum: {
        values: TASK_CATEGORIES,
        message: 'Category must be one of: Study, Work, Personal, Project, Other.',
      },
    },
    priority: {
      type: String,
      required: [true, 'Task priority is required.'],
      enum: {
        values: TASK_PRIORITIES,
        message: 'Priority must be Low, Medium, or High.',
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
