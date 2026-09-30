import TaskList from '../TaskList/TaskList.jsx';
import { formatDateLabel, getLocalDateString } from '../../utils/dateOnly.js';
import './CalendarPage.css';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1, 12);
  const leadingDays = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0, 12).getDate();
  const blanks = Array.from({ length: leadingDays }, (_, index) => `blank-${index}`);
  const dates = Array.from({ length: daysInMonth }, (_, index) => {
    return getLocalDateString(new Date(year, month, index + 1, 12));
  });

  return [...blanks, ...dates];
}

export default function CalendarPage({
  selectedDate,
  onSelectDate,
  tasks,
  loading,
  error,
  actionError,
  busyTaskId,
  onToggle,
  onDelete,
}) {
  const year = Number(selectedDate.slice(0, 4));
  const month = Number(selectedDate.slice(5, 7)) - 1;
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' })
    .format(new Date(year, month, 1, 12));
  const calendarDays = getCalendarDays(year, month);

  function changeMonth(offset) {
    const firstOfMonth = new Date(year, month + offset, 1, 12);
    onSelectDate(getLocalDateString(firstOfMonth));
  }

  function selectToday() {
    onSelectDate(getLocalDateString());
  }

  return (
    <section className="calendar-page" aria-labelledby="calendar-heading">
      <header className="calendar-toolbar">
        <div>
          <h2 id="calendar-heading">{monthLabel}</h2>
          <p>Select a date to view its tasks.</p>
        </div>
        <div className="calendar-controls">
          <button aria-label="Previous month" className="button button--quiet" onClick={() => changeMonth(-1)} type="button">
            Previous
          </button>
          <button className="button button--quiet" onClick={selectToday} type="button">Today</button>
          <button aria-label="Next month" className="button button--quiet" onClick={() => changeMonth(1)} type="button">
            Next
          </button>
        </div>
      </header>

      <div className="calendar-grid" aria-label={`${monthLabel} calendar`}>
        {weekdays.map((weekday) => (
          <span className="calendar-weekday" key={weekday}>{weekday}</span>
        ))}
        {calendarDays.map((date, index) => date.startsWith('blank-') ? (
          <span aria-hidden="true" className="calendar-day calendar-day--blank" key={date} />
        ) : (
          <button
            aria-label={formatDateLabel(date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            aria-pressed={date === selectedDate}
            className={`calendar-day${date === selectedDate ? ' calendar-day--selected' : ''}`}
            key={date}
            onClick={() => onSelectDate(date)}
            type="button"
          >
            {index - ((new Date(year, month, 1, 12).getDay() + 6) % 7) + 1}
          </button>
        ))}
      </div>

      <section className="calendar-tasks" aria-labelledby="calendar-tasks-heading">
        <div className="calendar-tasks__heading">
          <div>
            <h3 id="calendar-tasks-heading">
              {formatDateLabel(selectedDate, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            <p>Tasks scheduled for this date</p>
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
    </section>
  );
}