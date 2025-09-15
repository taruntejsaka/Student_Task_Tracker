# Student Task Tracker

A simple **Node.js + MongoDB project** that allows students to **register, log in, and manage their personal tasks**.  
Includes **authentication (JWT)**, **task dashboard with filters & sorting**, and a clean frontend with modern styling.

---

## Features
- **User Authentication**: Register, Login, Logout (JWT-based).  
- **Task Management**: Create, view, update, and delete tasks.  
- **Dashboard**: Filter tasks by status, priority, category, and search by title.  
- **Sorting**: Sort tasks by due date (asc/desc) or priority.  
- **Frontend UI**: Modern, responsive design with advanced CSS.  
- **Testing**: Unit and integration tests for auth & tasks.  

---

## Project Structure
```
student-task-tracker/
│── backend/
│   │── server.js           # Express app entry
│   │── config/db.js        # MongoDB connection
│   │── routes/             # API routes
│   │── models/             # Mongoose schemas
│   │── controllers/        # Auth & task logic
│   │── middleware/         # Auth middleware
│   │── tests/              # Jest + SuperTest tests
│   │── .env.example        # Example env variables
│   └── package.json
│
│── frontend/
│   │── index.html          # Landing page
│   │── register.html       # Register page
│   │── login.html          # Login page
│   │── dashboard.html      # Task dashboard
│   │── styles.css          # Advanced CSS
│
└── README.md
```

---

## Setup Instructions

### 1️ Backend Setup
1. Navigate into backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root (same folder as `server.js`):
   ```ini
   MONGO_URI=mongodb://localhost:27017/student_task_tracker
   JWT_SECRET=superVardhan123!
   PORT=5000
   ```

4. Start backend (with nodemon):
   ```bash
   npm run dev
   ```

You should see:
```
MongoDB connected
Server started on port 5000
```

---

### 2️ Frontend Setup
1. Navigate into `frontend/`:
   ```bash
   cd ../frontend
   ```

2. Open `index.html` in your browser, OR use a live server:
   ```bash
   npx serve .
   ```
   Then visit → `http://localhost:3000`

---

## Running Tests
Inside `backend/`, run:
```bash
npm test
```

This executes **Jest + SuperTest** tests for authentication and tasks.

---

##  API Endpoints

### Auth
- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Login & get JWT  
- `POST /api/auth/logout` → Logout (invalidate token)  
- `GET /api/me` → Get current logged-in user  

### Tasks
- `GET /api/tasks` → Get tasks (with filters & sorting)  
- `POST /api/tasks` → Create new task  
- `PUT /api/tasks/:id` → Update task  
- `DELETE /api/tasks/:id` → Delete task  

 Filters: `status`, `priority`, `category`, `search`  
 Sorting: `sortBy=dueDate&order=asc|desc`

---

##  Usage Flow
1. Register a new student account.  
2. Login with email + password → redirected to Dashboard.  
3. Dashboard:  
   - Filter by **status / priority / category**  
   - Search tasks by **title**  
   - Sort tasks by **due date / priority**  
   - Delete tasks  
4. Logout clears the session.  

---

##  Contributors
- **Sai Sri Vardhan Akula** – Backend & Database  
- **Tarun Tej Saka** – Frontend & UI  

---

##  Target Grade
Both contributors are aiming for **HD** (High Distinction).  
