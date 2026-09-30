import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CalendarPage from '../CalendarPage/CalendarPage.jsx';
import FilterBar from '../FilterBar/FilterBar.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import TaskForm from '../TaskForm/TaskForm.jsx';
import TasksPage from '../TasksPage/TasksPage.jsx';
import { createTask, deleteTask, getTasks, updateTask } from '../../services/taskApi.js';
import { getLocalDateString } from '../../utils/dateOnly.js';
import './App.css';

function TaskPlanner() {
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyTaskId, setBusyTaskId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const isTaskView = ['/tasks', '/calendar', '/pending', '/completed'].includes(location.pathname);
  const isCalendarView = location.pathname === '/calendar';
  const completed = location.pathname === '/pending'
    ? false
    : location.pathname === '/completed'
      ? true
      : undefined;

  useEffect(() => {
    if (!isTaskView) return undefined;

    let isCurrentRequest = true;
    setLoading(true);
    setLoadError('');
    const filters = {
      completed,
      category,
      priority,
      ...(isCalendarView ? { date: selectedDate } : {}),
    };

    getTasks(filters)
      .then((result) => {
        if (isCurrentRequest) setTasks(result);
      })
      .catch((error) => {
        if (isCurrentRequest) setLoadError(error.message);
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [isTaskView, isCalendarView, completed, category, priority, selectedDate, refreshKey]);

  async function handleAdd(task) {
    await createTask(task);
    setRefreshKey((current) => current + 1);
  }

  async function runTaskAction(task, action) {
    setActionError('');
    setBusyTaskId(task._id);
    try {
      await action();
      setRefreshKey((current) => current + 1);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setBusyTaskId('');
    }
  }

  function handleToggle(task) {
    return runTaskAction(task, () => updateTask(task._id, { completed: !task.completed }));
  }

  function handleDelete(task) {
    return runTaskAction(task, () => deleteTask(task._id));
  }

  const pageProps = {
    tasks,
    loading,
    error: loadError,
    actionError,
    busyTaskId,
    onToggle: handleToggle,
    onDelete: handleDelete,
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <section className="page-intro">
          <p className="eyebrow">YOUR DAY, IN ORDER</p>
          <h1>Make room for what matters.</h1>
        </section>
        <section className="capture-section" aria-label="Add a task">
          <TaskForm onAdd={handleAdd} />
        </section>
        <div className="view-toolbar">
          <FilterBar
            category={category}
            onCategoryChange={setCategory}
            onPriorityChange={setPriority}
            priority={priority}
          />
        </div>
        <Routes>
          <Route path="/" element={<Navigate replace to="/tasks" />} />
          <Route path="/tasks" element={<TasksPage title="All tasks" description="Everything on your list." {...pageProps} />} />
          <Route path="/calendar" element={<CalendarPage {...pageProps} onSelectDate={setSelectedDate} selectedDate={selectedDate} />} />
          <Route path="/pending" element={<TasksPage title="Pending" description="Still in progress." {...pageProps} />} />
          <Route path="/completed" element={<TasksPage title="Completed" description="Done and off your plate." {...pageProps} />} />
          <Route path="*" element={<Navigate replace to="/tasks" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TaskPlanner />
    </BrowserRouter>
  );
}