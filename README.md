# TaskMaster: Personal Task Management App

TaskMaster is a modern, full-stack application designed to help you organize, track, and manage your daily tasks efficiently. Built with React for the frontend and Node.js/Express for the backend, it offers a seamless and responsive user experience.

## Key Features

- Add, edit, and remove tasks with ease
- Mark tasks as complete or pending
- Visual indicators for overdue and completed tasks
- Responsive, visually appealing interface with Tailwind CSS
- Real-time updates and smooth user interactions
- Robust error handling and loading feedback

## Requirements

- Node.js (version 18 or newer)
- npm (version 8 or newer)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd task-management
   ```
2. **Install all dependencies:**
   ```bash
   npm install
   ```
3. **Start the development environment:**
   ```bash
   npm run dev
   ```
   This command launches both the backend (on port 5000) and the frontend (on port 3000) simultaneously.

## API Overview

- `GET /tasks` — Retrieve all tasks
- `POST /tasks` — Add a new task
- `PUT /tasks/:id` — Update an existing task
- `PUT /tasks/:id/complete` — Toggle completion status
- `DELETE /tasks/:id` — Remove a task

## Technology Stack

**Frontend:**
- React (with Hooks)
- Redux Toolkit (state management)
- Axios (HTTP requests)
- Tailwind CSS (styling)

**Backend:**
- Node.js
- Express
- CORS
- Body-parser

**Development Tools:**
- Nodemon (auto-reloads backend)
- Concurrently (runs frontend and backend together)

## Additional Information

- All dependencies are kept up to date for security and performance.
- The project is free of unused or deprecated packages.
- Some warnings may appear due to third-party dependencies, but these do not affect the core functionality.

---

*TaskMaster is designed and written from scratch for personal productivity. All documentation and code are original and tailored for this project.*
