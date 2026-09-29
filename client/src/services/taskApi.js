async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('Unable to reach the Task Planner API. Check that the server is running.');
  }

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message ?? 'The request could not be completed.');
  }

  return result.data;
}

export async function getTasks(filters = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== '' && value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : '';
  const data = await request(`/api/tasks${suffix}`);
  return data.tasks;
}

export async function createTask(task) {
  const data = await request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  });
  return data.task;
}

export async function updateTask(id, changes) {
  const data = await request(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
  return data.task;
}

export async function deleteTask(id) {
  const data = await request(`/api/tasks/${id}`, { method: 'DELETE' });
  return data.task;
}
