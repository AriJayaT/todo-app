// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { getAllTodos } from '../services/todoService';

const Dashboard = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getAllTodos();
        setTodos(data);
      } catch (err) {
        setError('Failed to fetch todos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  // Count completed and pending todos
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = todos.length - completedTodos;

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome, {user?.username || 'User'}!</h1>
          <p className="text-gray-400 mt-2">Manage your tasks efficiently</p>
        </div>
        
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Task Summary</h2>
            
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary-dark rounded-lg">
                  <span>Total Tasks</span>
                  <span className="text-xl font-semibold">{todos.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary-dark rounded-lg">
                  <span>Completed</span>
                  <span className="text-xl font-semibold text-green-500">{completedTodos}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-secondary-dark rounded-lg">
                  <span>Pending</span>
                  <span className="text-xl font-semibold text-yellow-500">{pendingTodos}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link to="/todo-list" className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg hover:bg-primary transition-colors">
                <span>View All Tasks</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link to="/profile" className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg hover:bg-primary transition-colors">
                <span>Update Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Tasks */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/todo-list" className="text-primary hover:underline text-sm">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : todos.length === 0 ? (
            <p className="text-gray-400">No tasks yet. Create one!</p>
          ) : (
            <div className="space-y-2">
              {todos.slice(0, 5).map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-3 bg-secondary-dark rounded-lg"
                >
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full mr-3 ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.title}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {todo.priority === 'high' ? (
                      <span className="text-red-500">High</span>
                    ) : todo.priority === 'medium' ? (
                      <span className="text-yellow-500">Medium</span>
                    ) : (
                      <span className="text-green-500">Low</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;