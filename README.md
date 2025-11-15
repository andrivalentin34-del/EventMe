# EventMe

Full-stack event discovery platform with a polished public site and an admin dashboard for curating local happenings. The frontend is a Vite + React SPA, while the backend is an Express API backed by Prisma/PostgreSQL and integrates image uploads, geocoding, and JWT-secured admin endpoints.

## Features
- Modern public landing page with hero, category shortcuts, FAQ, and highlighted events.
- Explore page with full-text search, category filtering, and sorting by date.
- Detailed event pages with rich descriptions, dynamic imagery, and CTA links.
- Admin login with JWT auth, event CRUD (create/upload, edit, delete), and automatic geocoding of locations.
- Image upload pipeline that stores files on the server and exposes them under `/uploads`.

## Tech Stack
- **Frontend:** React 18, Vite, React Router, Framer Motion, vanilla CSS modules.
- **Backend:** Node.js, Express 5, Prisma ORM, PostgreSQL, Multer for uploads, JSON Web Tokens, bcrypt.
- **Tooling:** npm, Nodemon, OpenStreetMap Nominatim geocoding.

## Repository Structure
```
EventMe/
├─ Frontend/        # React SPA (Vite + React Router)
├─ Backend/         # Express API + Prisma schema & migrations
├─ public/          # Static assets shared at the repo root
└─ README.md
```

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+ (or compatible)
- Internet access for geocoding requests to Nominatim (OpenStreetMap)

## Backend Setup (`Backend/`)
1. Install dependencies:
   ```bash
   cd Backend
   npm install
   ```
2. Create a `.env` file inside `Backend/` with your database connection string:
   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/eventme?schema=public"
   ```
3. Apply the Prisma schema to your database:
   ```bash
   npx prisma migrate dev
   # or, for a quick sync without migrations:
   # npx prisma db push
   ```
4. (Optional) Seed an admin user by hitting the register endpoint once:
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","password":"yourStrongPassword"}'
   ```
   > The frontend login form is currently wired to the `admin` username—adjust `Frontend/src/pages/admin/AdminLoginPage.jsx` if you prefer a different account.
5. Start the API (default port 5000):
   ```bash
   npm start           # runs server.js with Node
   # or for auto-reloads during development:
   npx nodemon server.js
   ```

### Backend Highlights
- `server.js` exposes REST endpoints under `/api` for events and auth.
- File uploads land in `Backend/uploads/` and are served from `http://localhost:5000/uploads/...`.
- Locations are geocoded via OpenStreetMap; failures fail gracefully, so the API still works offline.

## Frontend Setup (`Frontend/`)
1. Install dependencies:
   ```bash
   cd Frontend
   npm install
   ```
2. Start the development server (default port 5173):
   ```bash
   npm run dev
   ```
3. Build for production / preview:
   ```bash
   npm run build
   npm run preview
   ```

The frontend expects the backend at `http://localhost:5000`. If your API runs elsewhere, update the constants in `Frontend/src/services/api.js` and `Frontend/src/services/auth.js`.

## Running the Stack
1. Start PostgreSQL and ensure the `DATABASE_URL` points to a reachable database.
2. Launch the backend API (`npm start` in `Backend/`).
3. Launch the frontend dev server (`npm run dev` in `Frontend/`).
4. Open `http://localhost:5173`:
   - Public routes: `/`, `/events`, `/event/:id`
   - Admin routes: `/admin/login`, `/admin/events`, `/admin/add`, `/admin/edit/:id`

## Useful Commands
| Location  | Command                 | Description                        |
|-----------|-------------------------|------------------------------------|
| Backend   | `npm start`             | Run Express API                    |
| Backend   | `npx nodemon server.js` | API with auto-reload               |
| Backend   | `npx prisma studio`     | Inspect DB via Prisma Studio       |
| Frontend  | `npm run dev`           | Vite dev server                    |
| Frontend  | `npm run build`         | Production build                   |
| Frontend  | `npm run preview`       | Preview built assets locally       |

## API Overview
- `GET /api/events?category=&userLat=&userLon=` – list events (optional filters & distance calc).
- `GET /api/events/:id` – fetch a single event.
- `POST /api/events` – create event (multipart form with optional `image` field).
- `PUT /api/events/:id` – update event metadata.
- `DELETE /api/events/:id` – remove event.
- `POST /api/auth/login` – obtain admin JWT (username/password).
- `POST /api/auth/register` – create a new admin user.

## Image Assets
Hero graphics live in `Frontend/public/images/` as `hero-home.jpg` and `hero-events.jpg`. Replace them with your own photography (same filenames) to customize the look instantly.

## Troubleshooting
- **CORS / API errors:** confirm the backend is running on port 5000 and reachable from the browser.
- **Auth failures:** ensure the `admin` user exists in the DB and the password matches; tokens are stored in `localStorage`.
- **Geocoding limits:** OpenStreetMap rate-limits excessive requests—cache repeated locations when possible.

## Contributing
1. Fork the repo and create a feature branch.
2. Keep frontend and backend changes separated by directory.
3. Run `npm run build` (frontend) and exercise key API endpoints before submitting a PR.

Happy hacking! 🎉
