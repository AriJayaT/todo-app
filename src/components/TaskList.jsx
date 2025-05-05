import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, deleteTask, toggleTask, updateTask }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          updateTask={updateTask}
        />
      ))}
    </ul>
  );
}
