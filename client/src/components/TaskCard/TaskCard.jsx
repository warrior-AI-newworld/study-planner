import { formatDateLabel } from '../../utils/dateOnly.js';
import './TaskCard.css';

export default function TaskCard({ task, busy, onToggle, onDelete }) {
  return (
    <article className={`task-card${task.completed ? ' task-card--completed' : ''}`}>
      <label className="task-card__check">
        <input
          aria-label={task.completed ? 'Mark task pending' : 'Mark task completed'}
          checked={task.completed}
          disabled={busy}
          onChange={() => onToggle(task)}
          type="checkbox"
        />
        <span aria-hidden="true" />
      </label>
      <div className="task-card__content">
        <h3>{task.title}</h3>
        <div className="task-card__meta">
          <span>{task.category}</span>
          <span className={`priority priority--${task.priority.toLowerCase()}`}>{task.priority}</span>
          <time dateTime={task.date}>{formatDateLabel(task.date)}</time>
          <span className="task-status">{task.completed ? 'Completed' : 'Pending'}</span>
        </div>
      </div>
      <button
        aria-label={`Delete ${task.title}`}
        className="button button--quiet task-card__delete"
        disabled={busy}
        onClick={() => onDelete(task)}
        type="button"
      >
        Delete
      </button>
    </article>
  );
}