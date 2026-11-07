# Express Nodejs Backend Boilerplate

The backend is built using

- **Node.js v26.13.0**.
- **ExpressJs**.
- **MongoDB**.

## Getting Started

Install the project dependencies:

```bash
npm install
```

## Available Commands

| Command          | Description                           |
| ---------------- | ------------------------------------- |
| `npm start`      | Start the project                     |
| `npm run dev`    | Start the project in development mode |
| `npm run format` | Format the source code                |
| `npm run test`   | Run Test cases                        |

## API Documentation

Swagger API documentation is available at: `/docs`

## Admin Endpoints

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | `/api/v1/admin/login`      | Admin Login          |
| POST   | `/api/v1/admin/refresh`    | Refresh admin tokens |
| POST   | `/api/v1/admin/logout`     | Admin Logout         |
| GET    | `/api/v1/admin/users`      | Get all users        |
| DELETE | `/api/v1/admin/users/{id}` | Delete user by id    |

## User Endpoints

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| POST   | `/api/v1/user/register` | User Register         |
| POST   | `/api/v1/user/login`    | User Login            |
| POST   | `/api/v1/user/refresh`  | Refresh User token    |
| POST   | `/api/v1/user/logout`   | User Logout           |
| GET    | `/api/v1/user/me`       | Get logged-in user    |
| PATCH  | `/api/v1/user/me`       | Update logged-in user |
| DELETE | `/api/v1/user/me`       | Delete logged-in use  |
