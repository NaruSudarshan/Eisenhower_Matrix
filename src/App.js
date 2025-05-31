import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Matrix from './components/Matrix';
import TaskForm from './components/TaskForm';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';

const LOCAL_STORAGE_KEY = 'eisenhowerMatrixTasks';
const MODE_KEY = 'matrixMode';

function App() {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem(MODE_KEY) || 'local');
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  // Handle mode switch
  const handleModeSwitch = () => {
    const newMode = mode === 'local' ? 'cloud' : 'local';
    setMode(newMode);
    localStorage.setItem(MODE_KEY, newMode);
  };

  // Local mode: use localStorage
  useEffect(() => {
    if (mode === 'local') {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      setTasks(stored ? JSON.parse(stored) : []);
    }
    // Cloud mode handled below
    // eslint-disable-next-line
  }, [mode]);

  useEffect(() => {
    if (mode === 'local') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, mode]);

  // Cloud mode: use API
  useEffect(() => {
    if (mode === 'cloud' && isAuthenticated && user) {
      axios.get(`/api/tasks?user=${encodeURIComponent(user.sub)}`)
        .then(res => setTasks(res.data));
    } else if (mode === 'cloud') {
      setTasks([]);
    }
    // eslint-disable-next-line
  }, [mode, isAuthenticated, user]);

  useEffect(() => {
    localStorage.setItem('eisenhowerMatrixDarkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Add task
  const addTask = (task) => {
    if (mode === 'local') {
      setTasks(prev => [...prev, { ...task, id: Date.now() }]);
    } else if (mode === 'cloud' && user) {
      axios.post('/api/tasks', { ...task, user: user.sub })
        .then(res => setTasks(prev => [...prev, res.data]))
        .catch(err => {
          alert('Failed to add task. See console for details.');
          console.error('Add task error:', err.response ? err.response.data : err);
        });
    }
  };

  // Delete task
  const deleteTask = (id) => {
    if (mode === 'local') {
      setTasks(prev => prev.filter(t => t.id !== id));
    } else if (mode === 'cloud' && user) {
      axios.delete(`/api/tasks?id=${id}&user=${encodeURIComponent(user.sub)}`)
        .then(() => setTasks(prev => prev.filter(t => t._id !== id)));
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-title">Eisenhower Matrix</div>
        <div className="navbar-controls">
          <button className="dark-toggle" onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button className="dark-toggle" onClick={handleModeSwitch}>
            {mode === 'local' ? 'Cloud' : 'Local'}
          </button>
          {mode === 'cloud' && (isLoading ? null : isAuthenticated ? (
            <>
              <button className="dark-toggle" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Logout
              </button>
              <span style={{ marginLeft: 8, fontWeight: 500, color: '#6366f1', fontSize: '0.97rem' }}>
                {user.name || user.email}
              </span>
            </>
          ) : (
            <button className="dark-toggle" onClick={() => loginWithRedirect()}>
              Login
            </button>
          ))}
        </div>
      </nav>
      <div className="main-content">
        {mode === 'cloud' && !isAuthenticated ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: '#888' }}>
            <h2>Please log in to use your Eisenhower Matrix</h2>
          </div>
        ) : (
          <>
            <TaskForm onAdd={addTask} />
            <Matrix tasks={tasks} onDelete={deleteTask} />
          </>
        )}
      </div>
    </div>
  );
}

export default App; 