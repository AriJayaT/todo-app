import React, { useState } from "react";

export default function TaskItem({ task, deleteTask, toggleTask, updateTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim() !== "") {
      updateTask(task.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <li
      className={`flex items-center p-2 mb-2 rounded ${
        task.completed ? "bg-gray-700 line-through" : "bg-purple-800"
      }`}
    >
      {/* Left section (checkbox + text) */}
      <div
        className="flex items-center flex-grow min-w-0 cursor-pointer"
        onClick={!isEditing ? () => toggleTask(task.id) : undefined}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          onClick={(e) => e.stopPropagation()} // prevent double toggle
          className="mr-2"
        />
        {isEditing ? (
          // Editable input
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-1 text-black rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ) : (
          // Horizontal scroll container
          <span className="inline-block max-w-sm overflow-x-auto whitespace-nowrap">
            {task.text}
          </span>
        )}
      </div>

      {/* Right section (Update + Delete) */}
      <div className="flex space-x-2 ml-2">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="p-1 bg-green-600 rounded hover:bg-green-500"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded hover:bg-blue-500"
          >
            ✏️
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1 text-xl hover:bg-red-600"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}
