// src/services/todoService.js
import axios from 'axios';

// Create axios instance with credentials
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Get all todos
export const getAllTodos = async () => {
  try {
    const response = await api.get('/todos');
    return response.data.todos;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todos');
  }
};

// Create a new todo
export const createTodo = async (todoData) => {
  try {
    const response = await api.post('/todos', todoData);
    return response.data.todo;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create todo');
  }
};

// Get a todo by ID
export const getTodoById = async (id) => {
  try {
    const response = await api.get(`/todos/${id}`);
    return response.data.todo;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch todo');
  }
};

// Update a todo by ID
export const updateTodo = async (id, todoData) => {
  try {
    // Add this validation
    if (!id) {
      throw new Error('Todo ID is required');
    }
    
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data.todo;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update todo');
  }
};

// Delete a todo by ID
export const deleteTodo = async (id) => {
  try {
    await api.delete(`/todos/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete todo');
  }
};