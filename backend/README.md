# BeyondMemories Backend

Backend API for the BeyondMemories digital memorial platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI

4. Start development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Memorials
- `POST /api/memorials` - Create memorial
- `GET /api/memorials` - Get all user memorials
- `GET /api/memorials/:id` - Get memorial with memories
- `PUT /api/memorials/:id` - Update memorial
- `DELETE /api/memorials/:id` - Delete memorial

### Memories
- `POST /api/memories` - Create memory
- `GET /api/memories` - Get memories (with filters)
- `GET /api/memories/:id` - Get single memory
- `PUT /api/memories/:id` - Update memory
- `DELETE /api/memories/:id` - Delete memory
- `POST /api/memories/:id/upload` - Upload media file

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
