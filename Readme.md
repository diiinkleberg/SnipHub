# SnipHub - Code Snippet Sharing Application

A web application for sharing code snippets with syntax highlighting and user authentication.

## Features

- **CRUD Operations**: Create, view, edit, and delete code snippets
- **Syntax Highlighting**: Supports multiple programming languages
- **User Authentication**: Secure signup/login using JWT
- **Search & Filter**: Easily find snippets by language, keyword, or user
- **User Profiles**: View and manage personal snippets

## Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Frontend**: Vue.js 3 with Vite
- **API**: RESTful API

## Prerequisites

- Node.js (v16+)
- MongoDB

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AntonHennig/SnipHub.git
cd SnipHub
```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

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

### 3. Install Dependencies

```bash
npm run install-all
```

This script installs dependencies for both server and client.

### 4. Start the Application

To run both frontend and backend concurrently:

```bash
npm run dev
```

- Backend: http://localhost:5000
- API Documentation http://localhost:5000/api-docs
- Frontend: http://localhost:3000

## Available Scripts

- `npm run start`: Start the backend server only
- `npm run server`: Start the backend in development mode
- `npm run client`: Start the frontend development server
- `npm run dev`: Run both frontend and backend together
- `npm run install-all`: Install all dependencies
- `npm run seed`: Seed the database with sample users and snippets

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Users

- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/snippets` - Get all snippets by a specific user
- `GET /api/users/favorites` - Get all favorite snippets (auth required)
- `POST /api/users/favorites/:snippetId` - Add a snippet to favorites (auth required)
- `DELETE /api/users/favorites/:snippetId` - Remove a snippet from favorites (auth required)

### Snippets

- `GET /api/snippets` - Fetch all snippets (supports filters)
- `GET /api/snippets/:id` - Fetch a specific snippet
- `POST /api/snippets` - Create a new snippet (auth required)
- `PUT /api/snippets/:id` - Update a snippet (auth required)
- `DELETE /api/snippets/:id` - Delete a snippet (auth required)
- `GET /api/snippets/languages/list` - Get list of all programming languages used

## Data Models

### Snippet

```javascript
{
  title: String,           // Required
  code: String,            // Required
  programmingLanguage: String, // Required, default: 'javascript'
  description: String,     // Optional
  user: ObjectId,          // Reference to User
  createdAt: Date,         // Automatically set
  updatedAt: Date          // Automatically updated
}
```

### User

```javascript
{
  username: String,        // Required, unique
  email: String,           // Required, unique
  password: String,        // Required (stored as hash)
  favorites: [ObjectId],   // References to Snippets
  createdAt: Date,         // Automatically set
  updatedAt: Date          // Automatically updated
}
```
