import React from 'react';
import Task from './Task';
import './Matrix.css';

const quadrants = [
  { key: 'ui', label: 'Urgent & Important' },
  { key: 'uni', label: 'Urgent & Not Important' },
  { key: 'nui', label: 'Not Urgent & Important' },
  { key: 'nuni', label: 'Not Urgent & Not Important' },
];

function getQuadrant(task) {
  if (task.urgent && task.important) return 'ui';
  if (task.urgent && !task.important) return 'uni';
  if (!task.urgent && task.important) return 'nui';
  return 'nuni';
}

export default function Matrix({ tasks, onDelete }) {
  const quadrantTasks = {
    ui: [],
    uni: [],
    nui: [],
    nuni: [],
  };
  tasks.forEach((task) => {
    quadrantTasks[getQuadrant(task)].push(task);
  });

  return (
    <div className="matrix-grid">
      {quadrants.map((q) => (
        <div key={q.key} className="matrix-quadrant">
          <h2>{q.label}</h2>
          {quadrantTasks[q.key].length === 0 && <p className="empty">No tasks</p>}
          {quadrantTasks[q.key].map((task) => (
            <Task key={task._id} task={task} onDelete={onDelete} />
          ))}
        </div>
      ))}
    </div>
  );
} 