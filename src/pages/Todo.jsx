import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import useTasks from "../components/useTasks";

export default function Todo() {
  const [user] = useAuthState(auth);
  const { tasks, loading, addTask, deleteTask, toggleTask, updateTask} = useTasks();
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  const filteredTasks = showCompletedOnly
    ? tasks.filter((task) => task.completed)
    : tasks;

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen flex justify-center items-center text-white">
        <p className="text-xl">Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-800 to-black min-h-screen text-white p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">To-Do List</h1>
          <div className="flex items-center">
            {user?.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <span className="mr-4 hidden sm:inline">{user?.displayName || user?.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
          <TaskForm addTask={addTask} />
          <button
            onClick={() => setShowCompletedOnly(!showCompletedOnly)}
            className="w-full mb-4 p-2 bg-purple-700 rounded hover:bg-purple-600 cursor-pointer"
          >
            {showCompletedOnly ? "Show All" : "Show Completed"}
          </button>

          {tasks.length === 0 ? (
            <p className="text-center py-4">No tasks yet. Add one above!</p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-center py-4">No completed tasks yet.</p>
          ) : (
            <TaskList
              tasks={filteredTasks}
              deleteTask={deleteTask}
              toggleTask={toggleTask}
              updateTask={updateTask}
            />
          )}
        </div>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/profile"
            className="px-4 py-2 bg-purple-700 rounded hover:bg-purple-600 text-lg"
          >
            View Profile
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-lg"
          >
            Back to Landing
          </Link>
        </div>
      </div>
    </div>
  );
}
