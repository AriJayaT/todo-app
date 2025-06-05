// src/pages/TodoList.jsx
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TodoItem from '../components/TodoItem';
import TodoForm from '../components/TodoForm';
import { getAllTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const handleAddTodo = async (todoData) => {
    try {
      setLoading(true);
      const newTodo = await createTodo(todoData);
      setTodos([newTodo, ...todos]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update a todo
  const handleUpdateTodo = async (id, updatedData) => {
    try {
      console.log('Updating todo with ID:', id);
      console.log('Update data:', updatedData);
      
      // Make sure id is defined
      if (!id) {
        throw new Error('Todo ID is missing');
      }

      const updatedTodo = await updateTodo(id, updatedData);
      console.log('Successfully updated todo:', updatedTodo);
      
      // Update the state with the updated todo
      setTodos(todos.map(todo => 
        (todo._id === id || todo.id === id) ? updatedTodo : todo
      ));
      
      // Close the form after successful update
      setShowAddForm(false);
      setEditingTodo(null);
      setError(null);
    } catch (error) {
      console.error('Error in handleUpdateTodo:', error);
      setError('Failed to update todo: ' + error.message);
    }
  };

  // Toggle todo completion status
  const handleToggleTodo = async (id, completed) => {
    try {
      console.log('Toggling todo with ID:', id);
      console.log('New completed status:', completed);
      
      // Make sure id is defined
      if (!id) {
        throw new Error('Todo ID is missing');
      }
      
      // Call update function with just the completed field
      const updatedTodo = await updateTodo(id, { completed });
      
      // Update state with the updated todo
      setTodos(todos.map(todo => 
        (todo._id === id || todo.id === id) ? updatedTodo : todo
      ));
      
      setError(null);
    } catch (error) {
      console.error('Error in handleToggleTodo:', error);
      setError('Failed to update todo status: ' + error.message);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id) => {
    try {
      // Make sure id is defined
      if (!id) {
        throw new Error('Todo ID is missing');
      }
      
      await deleteTodo(id);
      
      // Update state by removing the deleted todo
      setTodos(todos.filter(todo => todo._id !== id && todo.id !== id));
      
      setError(null);
    } catch (err) {
      setError('Failed to delete todo: ' + err.message);
      console.error(err);
    }
  };

  // Edit a todo (set for editing)
  const handleEditTodo = (todo) => {
    console.log('Todo to edit:', todo);
    
    // Make sure the todo has an ID
    if (!todo || (!todo._id && !todo.id)) {
      console.error('Attempted to edit a todo without an ID:', todo);
      setError('Cannot edit this todo - missing ID');
      return;
    }
    
    setEditingTodo(todo);
    setShowAddForm(true);
  };

  // Filter todos based on status
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });

  return (
    <div className="min-h-screen bg-secondary text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">My Todo List</h1>
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingTodo(null);
            }}
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancel' : '+ Add Todo'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {/* Todo Form */}
        {showAddForm && (
          <div className="mb-6">
            <TodoForm
              onSubmit={editingTodo 
                ? (data) => handleUpdateTodo(editingTodo._id || editingTodo.id, data) 
                : handleAddTodo
              }
              initialData={editingTodo}
              isEditing={!!editingTodo}
            />
          </div>
        )}
        
        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-secondary-light text-gray-300 hover:bg-secondary-dark'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'active'
                ? 'bg-primary text-white'
                : 'bg-secondary-light text-gray-300 hover:bg-secondary-dark'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              filter === 'completed'
                ? 'bg-primary text-white'
                : 'bg-secondary-light text-gray-300 hover:bg-secondary-dark'
            }`}
          >
            Completed
          </button>
        </div>
        
        {/* Todo List */}
        <div className="space-y-2">
          {loading && !todos.length ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {filter === 'all' 
                ? 'No todos yet. Add one!' 
                : filter === 'active' 
                  ? 'No active todos.' 
                  : 'No completed todos.'}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id || todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onEdit={() => handleEditTodo(todo)}
                onDelete={() => handleDeleteTodo(todo._id || todo.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;