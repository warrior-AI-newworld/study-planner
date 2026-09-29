import './FilterBar.css';

const categories = ['Study', 'Work', 'Personal', 'Project', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

export default function FilterBar({ category, priority, onCategoryChange, onPriorityChange }) {
  return (
    <div className="filter-bar" aria-label="Filter tasks">
      <label className="field field--filter">
        <span>Category</span>
        <select onChange={(event) => onCategoryChange(event.target.value)} value={category}>
          <option value="">All categories</option>
          {categories.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
      <label className="field field--filter">
        <span>Priority</span>
        <select onChange={(event) => onPriorityChange(event.target.value)} value={priority}>
          <option value="">All priorities</option>
          {priorities.map((value) => <option key={value}>{value}</option>)}
        </select>
      </label>
    </div>
  );
}