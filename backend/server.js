const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for tasks
let tasks = [];
let taskId = 1;

// GET all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// POST new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const newTask = {
    _id: taskId++,
    title,
    description,
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update task
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed } = req.body;
  
  const taskIndex = tasks.findIndex(task => task._id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description || tasks[taskIndex].description,
    dueDate: dueDate || tasks[taskIndex].dueDate,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed
  };
  
  res.json(tasks[taskIndex]);
});

// PUT toggle task completion
app.put('/tasks/:id/complete', (req, res) => {
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(task => task._id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  res.json(tasks[taskIndex]);
});

// DELETE task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(task => task._id === parseInt(id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks = tasks.filter(task => task._id !== parseInt(id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});