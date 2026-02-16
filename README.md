# BlogApp

This is a full-stack blog application built with React, TypeScript, Express, MongoDB, and Cloudinary. It allows users to can create an account, update their profile information, delete their account, and create, delete blogs, and view blogs from other users.

## Setup .env

Before running the project locally, you need to create `.env` files for both the backend and frontend directories.

### backend/.env

```
MONGODB_URI=
DB_NAME=blog-db

CORS_ORIGIN=http://localhost:3000

JWT_TOKEN_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BASE_URL=http://localhost:8000
```

### frontend/.env

```
VITE_API_BASE=http://localhost:8000/api/v1
```

## Live

You can view the live version of this project at:

[https://blog-app-mini.vercel.app](https://blog-app-mini.vercel.app/)
