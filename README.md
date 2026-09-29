# Task Planner

A beginner-friendly MERN task planner. The React client talks to the Express API, and only the server connects to MongoDB.

## Backend setup

1. Install Node.js 20.19+ or 22.12+.
2. In `server/`, copy `.env.example` to `.env` and set `MONGO_URI` to a local MongoDB or MongoDB Atlas connection string. The server also accepts `MONGODB_URI`.
3. Run `npm install` and then `npm run dev` from `server/`.
4. The API runs at `http://localhost:5000`. Task endpoints support listing/filtering, creating, completing or reopening, and deleting tasks under `/api/tasks`.

## Frontend setup

1. In a second terminal, change to `client/`.
2. Run `npm install` and then `npm run dev`.
3. Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

The Vite development server forwards `/api` requests to the Express server on port 5000.

## Project structure

The backend follows an MVC-style flow: routes map API endpoints to controllers, controllers validate requests and coordinate with Mongoose models, and `app.js` wires the Express middleware and routes. `server.js` loads the environment, connects to MongoDB, and starts the HTTP server.

Each frontend UI component lives in its own folder under `client/src/components/`, with its JSX and component styles together. Shared API calls remain in `client/src/services/`, while `client/src/index.css` contains global styles and design tokens.
