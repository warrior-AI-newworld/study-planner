import TaskList from '../TaskList/TaskList.jsx';
import './TasksPage.css';

export default function TasksPage({ title, description, tasks, loading, error, actionError, busyTaskId, onToggle, onDelete }) {
  return (
    <section className="tasks-section" aria-labelledby="tasks-heading">
      <div className="tasks-section__heading">
        <div>
          <h2 id="tasks-heading">{title}</h2>
          <p>{description}</p>
        </div>
        {!loading && !error && <span className="task-count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>}
      </div>
      {actionError && <p className="action-error" role="alert">{actionError}</p>}
      <TaskList
        busyTaskId={busyTaskId}
        error={error}
        loading={loading}
        onDelete={onDelete}
        onToggle={onToggle}
        tasks={tasks}
      />
    </section>
  );
}