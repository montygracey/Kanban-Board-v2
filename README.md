# Krazy Kanban Board

A full-stack Kanban board application built with React, TypeScript, Express, and PostgreSQL. This application allows users to create, view, update, and delete tickets in a visual kanban-style board interface.

(note that this project runs perfectlly locally, but had issues uploading to render with all functions working.)
## Features

- User authentication with JWT
- Create, read, update, and delete tickets
- Assign tickets to users
- Move tickets between status columns (Todo, In Progress, Done)
- Sort and filter tickets by various properties
- Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router Dom
- JWT authentication
- Vite build tool

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL database
- Sequelize ORM
- JWT for authentication
- BCrypt for password hashing

## Project Structure

The project is organized into two main directories:

- `client/`: Contains the React frontend application
- `server/`: Contains the Express backend API

## Installation

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd krazy-kanban-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE kanban_db;
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   DB_NAME=kanban_db
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   JWT_SECRET_KEY=your_secret_key
   PORT=3001
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

## Running the Application

### Development Mode

To run both the frontend and backend in development mode:

```bash
npm run start:dev
```

This will:
- Start the backend server on port 3001
- Start the frontend development server on port 3000
- Set up a proxy from the frontend to the backend

### Production Mode

To build and run the application for production:

```bash
npm run start
```

This will:
- Build the React frontend
- Start the Express server which will serve both the API and the static frontend files

## API Endpoints

### Authentication
- `POST /auth/login` - Login a user

### Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get a specific ticket
- `POST /api/tickets` - Create a new ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Usage

1. Register or log in to the application
2. View existing tickets on the main board
3. Create new tickets by clicking "New Ticket"
4. Edit tickets by clicking the "Edit" button on a ticket
5. Delete tickets by clicking the "Delete" button on a ticket
6. Sort and filter tickets using the controls at the top of the board

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the ISC License.
