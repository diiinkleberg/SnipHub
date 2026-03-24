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
