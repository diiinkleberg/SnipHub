# SnipHub

SnipHub is a full-stack web application for storing, sharing, and discovering code snippets. It provides syntax highlighting across a wide range of programming languages, user authentication, and a favorites system so you can bookmark the snippets that matter most to you. Whether you are building a personal snippet library or sharing useful code with others, SnipHub gives you a clean, straightforward interface to do it.

---

## Features

- **CRUD Operations**: Create, view, edit, and delete your own code snippets.
- **Syntax Highlighting**: Powered by highlight.js with support for 40+ programming languages.
- **User Authentication**: Secure registration and login using JWT tokens (valid for 7 days).
- **Favorites**: Save snippets created by other users to your personal favorites list.
- **Search and Filter**: Browse and filter snippets by language, keyword, or author.
- **User Profiles**: View your own snippets and manage your account.
- **API Documentation**: Interactive Swagger UI available at `/api-docs`.
- **Database Seeding**: Quickly populate the database with sample users and snippets for development.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue.js 3, Vuex, Vue Router, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (JWT), bcryptjs |
| Styling | Bootstrap 5, Bootstrap Icons |
| API Docs | Swagger (swagger-jsdoc, swagger-ui-express) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local instance or a cloud connection string such as MongoDB Atlas)

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/diiinkleberg/SnipHub.git
cd SnipHub
```

**2. Configure environment variables**

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Open `.env` and set the following:

```env
# Backend
API_PORT=5000
MONGO_URI=mongodb://localhost:27017/sniphub
JWT_SECRET=your_secret_key_here

# Frontend
VITE_CLIENT_PORT=3000
VITE_API_BASE_URL=http://localhost:5000
```

You can generate a strong JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**3. Install all dependencies**

```bash
npm run install-all
```

This installs dependencies for the root, `server`, and `client` packages in a single step.

**4. Start the application**

```bash
npm run dev
```

This concurrently starts the backend and frontend development servers. Once running, the following URLs are available:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Server | http://localhost:5000 |
| API Documentation | http://localhost:5000/api-docs |

---

## Available Scripts

Run these from the project root:

| Script | Description |
|---|---|
| `npm run dev` | Start frontend and backend together (recommended for development) |
| `npm run start` | Start the backend server only (production mode) |
| `npm run server` | Start the backend in development mode with nodemon |
| `npm run client` | Start the frontend development server only |
| `npm run install-all` | Install all dependencies for root, server, and client |
| `npm run seed` | Seed the database with sample users and snippets |

---

## API Endpoints

Full interactive documentation is available at **http://localhost:5000/api-docs** when the server is running.

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login with email/username and password | No |
| GET | `/api/auth/me` | Get the current authenticated user's profile | Yes |

### Snippets

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/snippets` | Fetch all snippets (supports filters) | No |
| GET | `/api/snippets/:id` | Fetch a specific snippet by ID | No |
| POST | `/api/snippets` | Create a new snippet | Yes |
| PUT | `/api/snippets/:id` | Update an existing snippet | Yes (owner only) |
| DELETE | `/api/snippets/:id` | Delete a snippet | Yes (owner only) |
| GET | `/api/snippets/languages/list` | Get a list of all languages in use | No |

### Users

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/users/:id` | Get a user by ID | No |
| GET | `/api/users/:id/snippets` | Get all snippets by a specific user | No |
| GET | `/api/users/favorites` | Get the authenticated user's favorites | Yes |
| POST | `/api/users/favorites/:snippetId` | Add a snippet to favorites | Yes |
| DELETE | `/api/users/favorites/:snippetId` | Remove a snippet from favorites | Yes |

> Protected endpoints require an `x-auth-token` header containing a valid JWT.

---

## Data Models

### Snippet

```javascript
{
  title: String,               // Required
  code: String,                // Required
  programmingLanguage: String, // Required, default: 'javascript'
  description: String,         // Optional
  user: ObjectId,              // Reference to User
  createdAt: Date,             // Set automatically
  updatedAt: Date              // Updated automatically
}
```

### User

```javascript
{
  username: String,            // Required, unique
  email: String,               // Required, unique
  password: String,            // Required (stored as bcrypt hash)
  favorites: [ObjectId],       // References to Snippets
  createdAt: Date,             // Set automatically
  updatedAt: Date              // Updated automatically
}
```

---

## Project Structure

```
SnipHub/
├── client/                    # Vue.js 3 frontend (Vite)
│   └── src/
│       └── views/             # Page-level components
│           ├── Home.vue
│           ├── CreateSnippet.vue
│           ├── EditSnippet.vue
│           ├── SnippetDetail.vue
│           ├── Profile.vue
│           ├── Favorites.vue
│           ├── Login.vue
│           ├── Register.vue
│           └── NotFound.vue
├── server/                    # Express.js backend
│   ├── config/                # Database connection configuration
│   ├── middleware/            # JWT authentication middleware
│   ├── models/                # Mongoose data models
│   ├── routes/                # API route handlers and Swagger spec
│   ├── server.js              # Server entry point
│   ├── seedDB.js              # Database seeding script
│   └── swagger.js             # Swagger configuration
├── .env.example               # Environment variable template
├── package.json               # Root package with shared scripts
└── Readme.md
```

---

## Authentication

Authentication uses JSON Web Tokens. After registering or logging in, the server returns a token that must be included in the `x-auth-token` header for all protected requests:

```
x-auth-token: <your_jwt_token>
```

Tokens expire after 7 days. Login supports both email address and username as the identifier.

---

## License

This project is licensed under the ISC License.
