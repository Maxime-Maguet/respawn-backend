# 🎮 Respawn — Backend

> REST API for Respawn, a gaming library hub. Handles authentication, game data (via RAWG API), and personal library management.

**Live API:** [respawn-backend-ajr6.onrender.com](https://respawn-backend-ajr6.onrender.com)  
**Frontend Repo:** [github.com/Maxime-Maguet/respawn-frontend](https://github.com/Maxime-Maguet/respawn-frontend)

---

## ✨ Features

- **JWT Authentication** — Secure signup/signin with bcrypt password hashing
- **RAWG API Integration** — Search, discover (trending/recent/upcoming), and full game details
- **NSFW Filtering** — Automatic tag-based filtering on discover endpoints
- **Personal Library** — Full CRUD for user game collections
- **Status & Rating** — Track game status and personal ratings
- **Session Journal** — Log gaming sessions with date and notes
- **Game Metadata** — Screenshots, stores, tags, publishers, developers, platforms

---

## 🛠 Tech Stack

| Category       | Technology                |
| -------------- | ------------------------- |
| Runtime        | Node.js                   |
| Framework      | Express 5                 |
| Database       | MongoDB Atlas + Mongoose  |
| Authentication | JWT + bcrypt              |
| Validation     | express-validator         |
| External API   | RAWG Video Games Database |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account
- A RAWG API key ([rawg.io/apidocs](https://rawg.io/apidocs))

### Installation

```bash
git clone https://github.com/Maxime-Maguet/respawn-backend.git
cd respawn-backend
npm install
```

### Environment Variables

Create a `.env` file at the root:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAWG_API_KEY=your_rawg_api_key
```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### Auth — `/auth`

| Method | Endpoint       | Description           | Auth |
| ------ | -------------- | --------------------- | ---- |
| POST   | `/auth/signup` | Register a new user   | ❌   |
| POST   | `/auth/signin` | Login and receive JWT | ❌   |

### Games — `/game`

| Method | Endpoint         | Description                                   | Auth |
| ------ | ---------------- | --------------------------------------------- | ---- |
| GET    | `/game/search`   | Search games by name                          | ❌   |
| GET    | `/game/discover` | Trending / recent / upcoming games            | ❌   |
| GET    | `/game/:id`      | Full game details (screenshots, stores, tags) | ❌   |

### Library — `/library`

| Method | Endpoint                     | Description                       | Auth |
| ------ | ---------------------------- | --------------------------------- | ---- |
| GET    | `/library`                   | Get user's library                | ✅   |
| POST   | `/library/addGame`           | Add a game to library             | ✅   |
| PUT    | `/library/updateLibrary/:id` | Update status, rating, or journal | ✅   |
| DELETE | `/library/removeLibrary/:id` | Remove a game from library        | ✅   |

---

## 📁 Project Structure

```
├── middleware/
│   └── auth.js         # JWT verification middleware
├── models/
│   ├── users.js        # User schema
│   ├── games.js        # Game schema
│   ├── library.js      # Library schema (status, rating, journal)
│   └── connection.js   # MongoDB connection
└── routes/
    ├── auth.js         # Signup / Signin
    ├── user.js         # User routes
    ├── games.js        # RAWG integration
    └── libraries.js    # Library CRUD
```

---

## 🌐 Deployment

Deployed on **Render** (free tier) with automatic deployments on push to `main`.

> ⚠️ Note: The free tier spins down after 15 minutes of inactivity. The first request may take up to 50 seconds to respond.

---

## 👤 Author

**Maxime Maguet** — Fullstack JS Developer  
RNCP Level 6 — La Capsule Bootcamp (Batch 194, April 2026)

[![GitHub](https://img.shields.io/badge/GitHub-Maxime--Maguet-181717?logo=github)](https://github.com/Maxime-Maguet)
