# 📋 Task Manager — HedgeOne Screening Project

A full stack Task Management Dashboard built as part of the HedgeOne Consultants LLP Full Stack Developer Intern screening project (Summer 2026).

---

## 🚀 Live Features

- 🔐 **Authentication** — Secure login & signup via Supabase Auth
- ✅ **Task CRUD** — Create, view, edit, and delete tasks
- 📊 **Dashboard** — Stats overview with total, todo, in-progress, and completed counts
- 🔍 **Search & Filter** — Filter tasks by status, search by title
- 📅 **Due Dates** — Overdue task highlighting
- 📈 **Task Progress** — Completion rate tracker
- 🕐 **Recent Activity** — Latest tasks in right sidebar
- 🚪 **Logout** — Session management

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js + Vite                   |
| Backend    | Node.js + Express.js              |
| Database   | PostgreSQL via Supabase            |
| Auth       | Supabase Auth (Email + Password)  |
| HTTP Client| Axios                             |
| Dev Tools  | Nodemon, dotenv, CORS             |

---

## 📁 Project Structure

```
task-manager/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── App.jsx          # Main dashboard component
│   │   ├── Auth.jsx         # Login / Signup page
│   │   └── supabaseClient.js # Supabase client setup
│   ├── .env               # Frontend environment variables
│   └── package.json
│
├── backend/           # Node.js + Express API
│   ├── index.js           # Express server + API routes
│   ├── .env               # Backend environment variables
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm
- A [Supabase](https://supabase.com) account (free tier)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

---

### 2. Supabase Setup

1. Create a new project on [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the following to create the tasks table:

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Go to **Authentication → Providers** and make sure Email is enabled
4. (Optional for development) Turn off **Confirm email** under Auth settings

---

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
```

> Get these from Supabase → Project Settings → API

Start the backend:

```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Get these from Supabase → Project Settings → API

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 5. Running the Full App

Open **two terminals** simultaneously:

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## 🤖 AI Tools Used

| Tool       | How it was used                                              |
|------------|--------------------------------------------------------------|
| **Claude** (Anthropic) | UI design, debugging React hooks, code generation, Supabase auth integration, README writing |
| **Cursor** | Code editing, AI-assisted development environment            |

> All AI tools were used in accordance with the assignment guidelines which explicitly allow AI-assisted development.

---

## 📌 API Endpoints

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/tasks`      | Fetch all tasks    |
| POST   | `/api/tasks`      | Create a new task  |
| PUT    | `/api/tasks/:id`  | Update a task      |
| DELETE | `/api/tasks/:id`  | Delete a task      |

---

## 👩‍💻 Author

Built with ❤️ for the HedgeOne Consultants LLP Internship Screening — Summer 2026
