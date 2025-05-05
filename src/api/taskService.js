// client/src/api/taskService.js
export async function fetchTasks(user) {
    const token = await user.getIdToken();
  
    const response = await fetch('/api/tasks', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  }
  