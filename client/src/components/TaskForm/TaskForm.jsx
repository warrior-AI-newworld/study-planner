import { useState } from 'react';
import { getLocalDateString } from '../../utils/dateOnly.js';
import './TaskForm.css';

const categories = ['Study', 'Work', 'Personal', 'Project', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getLocalDateString());
  const [category, setCategory] = useState('Study');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onAdd({ title, category, priority, date });
      setTitle('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__title-row">
        <label className="field field--title">
          <span>Task</span>
          <input
            autoComplete="off"
            maxLength={200}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What needs to get done?"
            required
            value={title}
          />
        </label>
        <label className="field">
          <span>Category</span>
          <select onChange={(event) => setCategory(event.target.value)} value={category}>
            {categories.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Priority</span>
          <select onChange={(event) => setPriority(event.target.value)} value={priority}>
            {priorities.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="field field--date">
          <span>Date</span>
          <input onChange={(event) => setDate(event.target.value)} required type="date" value={date} />
        </label>
        <button className="button button--primary task-form__submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Adding...' : 'Add task'}
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}