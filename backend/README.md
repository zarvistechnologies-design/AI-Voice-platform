# AI Voice Platform Backend

TypeScript Express API setup with MongoDB via Mongoose.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Update `MONGODB_URI` in `.env` when using MongoDB Atlas or another database.
Set `JWT_SECRET` to a long random string before using real accounts.

## Auth Endpoints

- `POST /api/auth/register` creates a user and returns a JWT.
- `POST /api/auth/login` signs in with email/password and returns a JWT.
- `GET /api/auth/me` returns the current user when sent `Authorization: Bearer <token>`.

## Scripts

- `npm run dev` starts the API in watch mode.
- `npm run build` compiles TypeScript to `dist`.
- `npm start` runs the compiled server.
- `npm run typecheck` checks TypeScript without emitting files.
