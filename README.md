# AI Fitness Planner (Auth Based)

A full-stack MERN application that generates personalized AI-powered fitness plans based on a user's fitness profile and goals. Users can register, log in, generate plans, view history, regenerate plans, and download plans as PDF.

Built for the MERN Stack Interview Practical Assignment.

---

## Tech Stack

**Frontend:** React.js (Vite), React Router, Tailwind CSS, Axios, react-hot-toast, jsPDF
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Auth, bcryptjs
**AI:** GAMINI API (pluggable — swap provider in `backend/src/services/aiService.js`). Falls back to a deterministic mock generator if no API key is set, so the app remains fully runnable for evaluation without any AI credentials.

---

## Project Structure

```
ai-fitness-planner/
├── backend/
│   ├── src/
│   │   ├── config/          # env loader, DB connection
│   │   ├── controllers/     # route handler logic (auth, fitness plans)
│   │   ├── middlewares/     # auth guard, error handler, validation, 404
│   │   ├── models/          # Mongoose schemas (User, FitnessPlan)
│   │   ├── routes/          # Express routers
│   │   ├── services/        # aiService.js — AI provider integration
│   │   ├── utils/           # ApiError, catchAsync, JWT helpers, seed script
│   │   ├── validators/      # request payload validation
│   │   ├── app.js           # Express app (middleware pipeline)
│   │   └── server.js        # entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # axios instance + API call modules
│   │   ├── components/
│   │   │   ├── common/       # Navbar, Spinner
│   │   │   └── fitness/      # FitnessProfileForm, FitnessPlanResult
│   │   ├── context/          # AuthContext (JWT session state)
│   │   ├── pages/            # Home, Login, Register, Dashboard, Plans, PlanDetail
│   │   ├── routes/           # ProtectedRoute
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Features Implemented

### 1. Authentication
- Register / Login with hashed passwords (bcrypt, 12 salt rounds)
- JWT-based auth (Bearer token + httpOnly cookie support)
- Protected routes on both frontend (`ProtectedRoute`) and backend (`protect` middleware)
- Logout clears client token + server cookie

### 2. Fitness Profile Form
Collects Name, Age, Gender, Height, Weight, Fitness Goal, Activity Level, Workout Days/Week — with both frontend and backend validation.

### 3. AI Fitness Plan Generation
Generates: Workout Plan, Diet Suggestions, Daily Calorie Recommendation, Weekly Schedule, Fitness Tips, Weekly Motivation Message. Provider-agnostic service layer (`aiService.js`) — swap OpenAI for Gemini/Claude by editing one file.

### 4. Fitness Plan History
- List all previously generated plans (paginated)
- View a single plan in detail
- Delete a plan
- All queries scoped to `req.user._id` — users can only ever access their own plans (enforced at the DB query level, not just UI)

### 5. Display & Regenerate
Clean plan display with stat cards, workout schedule breakdown, tips, and motivation banner. "Regenerate" creates a fresh AI plan from the same profile.

### Bonus Implemented
- **Progress tracking**: `POST /api/v1/fitness-plans/:id/progress` lets users log weight/notes over time (`progressLogs` array on the plan).
- **Download as PDF**: client-side PDF generation via jsPDF on the plan detail view.

---

## Security Measures
- Passwords hashed with bcrypt, never returned in API responses (`toJSON` strips it)
- JWT signed with secret, expiry configurable
- `helmet` for secure HTTP headers
- `express-mongo-sanitize` against NoSQL injection
- `xss-clean` against XSS payloads
- `express-rate-limit` on all `/api` routes
- Centralized error handler — no stack traces leaked in production
- Ownership checks on every fitness-plan query (`{ user: req.user._id }`)
- Input validation on both client and server for every mutating endpoint

---

## Setup Instructions

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas cluster)
- (Optional) OpenAI API key for real AI generation — otherwise a mock generator is used automatically

### 1. Clone & install

```bash
git clone <your-repo-url>
cd ai-fitness-planner

# Backend
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and (optionally) OpenAI API key

# Frontend
cd ../frontend
npm install
cp .env.example .env
# edit VITE_API_BASE_URL if backend runs on a different host/port
```

### 2. Seed sample data (optional, for quick testing)

```bash
cd backend
npm run seed
```

This creates a sample user:
- Email: `john.doe@example.com`
- Password: `password123`

along with one sample fitness plan.

### 3. Run the app

```bash
# Terminal 1 - backend
cd backend
npm run dev      # http://localhost:5000

# Terminal 2 - frontend
cd frontend
npm run dev       # http://localhost:5173
```

---

## API Reference (base: `/api/v1`)

| Method | Endpoint                          | Access  | Description                        |
|--------|------------------------------------|---------|-------------------------------------|
| GET    | `/health`                          | Public  | Health check                        |
| POST   | `/auth/register`                   | Public  | Register new user                   |
| POST   | `/auth/login`                      | Public  | Login, returns JWT                  |
| POST   | `/auth/logout`                     | Private | Clear auth cookie                   |
| GET    | `/auth/me`                         | Private | Get current user                    |
| POST   | `/fitness-plans`                   | Private | Generate new AI fitness plan        |
| GET    | `/fitness-plans`                   | Private | List my plans (paginated)           |
| GET    | `/fitness-plans/:id`                | Private | Get single plan (must be owner)     |
| DELETE | `/fitness-plans/:id`                | Private | Delete plan (must be owner)         |
| POST   | `/fitness-plans/:id/regenerate`     | Private | Regenerate plan from same profile   |
| POST   | `/fitness-plans/:id/progress`       | Private | Add a progress log entry (bonus)    |

All `Private` routes require `Authorization: Bearer <token>` header.

---

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list.

---

## Sample Test Data
Run `npm run seed` in `backend/` — see "Seed sample data" above.

---

## Live App URL
_Add your deployed URL here after deployment (e.g. Render/Railway for backend, Vercel/Netlify for frontend)._

## GitHub Repository
_Add your repository URL here._

# AI-Fitness-Planner-Auth-Based-