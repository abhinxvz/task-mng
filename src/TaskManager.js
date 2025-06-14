import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/aurora.css';

const API_URL = 'http://localhost:5000';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', description: '', dueDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please make sure the server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/tasks`, {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        dueDate: newTask.dueDate || new Date().toISOString().split('T')[0]
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: '' });
      setError('');
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e, taskId) => {
    e.preventDefault();
    if (!editTask.title.trim() || !editTask.description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, {
        title: editTask.title.trim(),
        description: editTask.description.trim(),
        dueDate: editTask.dueDate
      });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setEditingTask(null);
      setEditTask({ title: '', description: '', dueDate: '' });
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      setError('');
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/tasks/${taskId}/complete`);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      setError('');
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setEditTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate
    });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTask({ title: '', description: '', dueDate: '' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen relative">
      <div className="dark-background"></div>
      <div className="aurora-overlay"></div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="navbar-glass sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-white">
                  <span className="text-blue-400">Task</span>Master
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-300">
                  <span className="text-blue-400 font-semibold">{pendingTasks.length}</span> pending
                </div>
                <div className="text-sm text-gray-300">
                  <span className="text-green-400 font-semibold">{completedTasks.length}</span> completed
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <header className="py-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Task Management
          </h1>
          <p className="text-xl text-gray-300">Organize your tasks efficiently and stay productive</p>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 glass-card">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Add New Task Form */}
          <div className="mb-8 glass-card rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 glass-input rounded-lg placeholder-gray-400 transition-all duration-200"
                    placeholder="Enter task title"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 glass-input rounded-lg transition-all duration-200"
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-4 py-3 glass-input rounded-lg placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter task description"
                  rows="3"
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 btn-primary rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>

          {/* Tasks List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Your Tasks ({tasks.length})
            </h2>
            
            {loading && tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                <p className="text-gray-300 mt-4">Loading tasks...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-xl">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No tasks yet</h3>
                <p className="text-gray-400">Create your first task to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className={`glass-card rounded-xl p-6 transition-all duration-300 ${
                      task.completed ? 'opacity-75' : ''
                    }`}
                  >
                    {editingTask === task._id ? (
                      <form onSubmit={(e) => handleUpdate(e, task._id)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                            <input
                              type="text"
                              value={editTask.title}
                              onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                              className="w-full px-4 py-2 glass-input rounded-lg"
                              required
                              disabled={loading}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Due Date</label>
                            <input
                              type="date"
                              value={editTask.dueDate}
                              onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                              className="w-full px-4 py-2 glass-input rounded-lg"
                              disabled={loading}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                          <textarea
                            value={editTask.description}
                            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                            className="w-full px-4 py-2 glass-input rounded-lg"
                            rows="3"
                            required
                            disabled={loading}
                          />
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-4 py-2 btn-secondary rounded-lg"
                            disabled={loading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 btn-primary rounded-lg disabled:opacity-50"
                            disabled={loading}
                          >
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className={`text-xl font-semibold ${
                                task.completed ? 'line-through text-gray-400' : 'text-white'
                              }`}>
                                {task.title}
                              </h3>
                              {task.completed && (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                  Completed
                                </span>
                              )}
                              {!task.completed && task.dueDate && isOverdue(task.dueDate) && (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                                  Overdue
                                </span>
                              )}
                            </div>
                            <p className={`mb-3 ${
                              task.completed ? 'text-gray-400' : 'text-gray-300'
                            }`}>
                              {task.description}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              {task.dueDate && (
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Due: {formatDate(task.dueDate)}
                                </div>
                              )}
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Created: {formatDate(task.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleToggleComplete(task._id)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                task.completed
                                  ? 'btn-secondary'
                                  : 'btn-success'
                              }`}
                              disabled={loading}
                            >
                              {task.completed ? 'Mark Pending' : 'Mark Complete'}
                            </button>
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                              disabled={loading}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(task._id)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10"
                              disabled={loading}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;