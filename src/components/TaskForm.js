import React, { useState } from 'react';
import './TaskForm.css';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, urgent, important });
    setTitle('');
    setDescription('');
    setUrgent(false);
    setImportant(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={urgent}
          onChange={() => setUrgent((u) => !u)}
        />
        Urgent
      </label>
      <label>
        <input
          type="checkbox"
          checked={important}
          onChange={() => setImportant((i) => !i)}
        />
        Important
      </label>
      <button type="submit">Add Task</button>
    </form>
  );
} 