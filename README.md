# Study Planner

A MERN task planner. The React client uses the Express API, and only the server connects to MongoDB.

## Features

- Create tasks with a title, date, category, and priority.
- View all, pending, or completed tasks.
- Filter tasks by category and priority.
- Browse tasks by date in the calendar.
- Complete, reopen, and delete tasks.

Task dates use `YYYY-MM-DD` date-only values; no time-of-day scheduling is used.

## Local development

1. Install Node.js 22.12+.
2. In `server/`, copy `.env.example` to `.env` and set `MONGODB_URI` to a local MongoDB or MongoDB Atlas connection string.
3. From `server/`, run `npm install` and then `npm run dev`.
4. In a second terminal, go to `client/`, run `npm install`, then run `npm run dev`.
5. Open the Vite URL, usually `http://localhost:5173`. Vite forwards `/api` requests to the server on port 5000.

The server uses `MONGODB_URI` as its primary connection variable and `PORT` from the environment, with port 5000 as the local fallback. `MONGO_URI` remains supported as a local compatibility alias.

## Deploy as one Render Web Service

The root [`render.yaml`](render.yaml) defines one Node Web Service. It builds the Vite client and starts Express, which serves both the React application and the API from the same origin.

To use the blueprint, connect `warrior-AI-newworld/study-planner` to Render and create a Blueprint Instance from the repository. The service root directory must remain the repository root.

If creating the Web Service manually, use:

- **Root directory:** repository root (leave blank)
- **Build command:** `npm ci --prefix server && npm ci --prefix client && npm run build --prefix client`
- **Start command:** `npm start --prefix server`
- **Environment variables:** `MONGODB_URI` set to the MongoDB Atlas connection string and `NODE_ENV=production`. Render provides `PORT` automatically.

Do not set `VITE_API_URL`; the client calls relative `/api/...` paths so production requests stay on the same Render host. For Atlas, create a database user with limited permissions and allow network access from the Render service. Never commit `.env` files or put MongoDB credentials in client variables.

The single Render URL serves `/`, `/tasks`, `/calendar`, `/pending`, `/completed`, and `/api/tasks`. The API also supports filters such as `?completed=false`, `?date=2026-09-30`, `?category=Study`, and `?priority=High`; filters can be combined.

## Project structure

- `client/src/components/`: one folder per UI component, with JSX and CSS together.
- `client/src/services/`: browser-to-API requests.
- `server/routes/`: REST endpoint declarations.
- `server/controllers/`: request validation and task operations.
- `server/models/`: Mongoose schemas.
- `server/app.js`: Express middleware, API routes, static frontend, and React Router fallback.
- `server/server.js`: environment loading, MongoDB connection, and HTTP startup.
