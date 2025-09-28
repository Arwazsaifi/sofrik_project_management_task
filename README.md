# Project Management Tool

Project management application built with NestJS, React, TypeScript, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Project Management**: Create, update, delete, and view projects
- **Task Management**: Full CRUD operations for tasks with project association
- **Status Tracking**: Track project and task statuses
- **Seed Data**: Pre-populated database with test data

## Tech Stack

### Backend
- NestJS (Node.js framework)
- MongoDB with Mongoose
- JWT authentication
- bcrypt for password hashing
- Class-validator for validation


## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install


### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/project-management

# JWT
JWT_SECRET=secret
JWT_EXPIRES_IN=7d

# Server
PORT=3001
```

### 3. Database Setup

Make sure MongoDB is running on your system. The application will connect to `mongodb://localhost:27017/project-management`.

### 4. Seed the Database

```bash
# Run the seed script to populate the database with test data
npm run backend:seed
```

This will create:
- One test user (email: test@example.com, password: Test@123)
- 2 sample projects
- 6 sample tasks (3 per project)

### 5. Start the Application


```bash
# Backend only (runs on http://localhost:3001)
npm run start:dev


## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (protected)

### Projects
- `GET /projects` - Get user's projects (protected)
- `POST /projects` - Create a new project (protected)
- `GET /projects/:id` - Get project by ID (protected)
- `PUT /projects/:id` - Update project (protected)
- `DELETE /projects/:id` - Delete project (protected)

### Tasks
- `GET /tasks` - Get tasks for a project (protected)
- `POST /tasks` - Create a new task (protected)
- `PUT /tasks/:id` - Update task (protected)
- `DELETE /tasks/:id` - Delete task (protected)

## Test Data

After running the seed script, you can login with:
- **Email**: test@example.com
- **Password**: Test@123

## Project Structure

```
project-management-tool/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── projects/       # Projects module
│   │   ├── tasks/          # Tasks module
│   │   ├── users/          # Users module
│   │   └── database/       # Database configuration
│   └── seed/               # Seed scripts
└── README.md
```

## Development

### Backend Development
```bash
cd backend
npm run start:dev
```

### Running Tests
```bash
# Run all tests
npm run test




