import TaskCard from '../TaskCard/TaskCard.jsx';
import './TaskList.css';

export default function TaskList({ tasks, loading, error, busyTaskId, onToggle, onDelete }) {
  if (loading) {
    return <p className="list-message">Loading tasks...</p>;
  }

  if (error) {
    return <p className="list-message list-message--error" role="alert">{error}</p>;
  }

  if (tasks.length === 0) {
    return <p className="list-message">No tasks here yet.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          busy={busyTaskId === task._id}
          key={task._id}
          onDelete={onDelete}
          onToggle={onToggle}
          task={task}
        />
      ))}
    </div>
  );
}