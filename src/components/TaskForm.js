import React, { useState } from 'react';
import './TaskForm.css';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description: showDescription ? description : '', urgent, important });
    setTitle('');
    setDescription('');
    setUrgent(false);
    setImportant(false);
    setShowDescription(false);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-row">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
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
      </div>
      <div className="task-form-row">
        {!showDescription ? (
          <button
            type="button"
            className="desc-toggle-btn"
            onClick={() => setShowDescription(true)}
          >
            + Add Description
          </button>
        ) : (
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
          />
        )}
      </div>
      <div className="task-form-row">
        <button type="submit">Add Task</button>
      </div>
    </form>
  );
} 