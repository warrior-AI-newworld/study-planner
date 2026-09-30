export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(dateString, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, options);
}