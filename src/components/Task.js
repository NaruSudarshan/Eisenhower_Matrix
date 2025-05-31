import React from 'react';
import './Task.css';

export default function Task({ task, onDelete, useLocal }) {
  return (
    <div className="task">
      <div className="task-header">
        <strong>{task.title}</strong>
        <button className="delete-btn" onClick={() => onDelete(useLocal ? task.id : task._id)}>&times;</button>
      </div>
      {task.description && <div className="task-desc">{task.description}</div>}
    </div>
  );
} 