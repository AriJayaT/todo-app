import React, { useState } from "react";

export default function TaskForm({ addTask }) {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    addTask(task);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="flex-grow p-3 rounded-l bg-gray-200 text-black text-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Enter a new task..."
      />
      <button
        type="submit"
        className="p-3 bg-purple-700 rounded-r hover:bg-purple-600 cursor-pointer"
      >
        Add Task
      </button>
    </form>
  );
}
