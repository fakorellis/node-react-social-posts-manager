# social-posts-manager

# 📌 Overview
## The Social Posts Manager is a web application designed to manage user-generated posts, authentication, and interactions (likes/unlikes). It follows clean architecture principles, ensuring scalability, maintainability, and separation of concerns.

# 🛠️ Technology Stack
## Backend
### Node.js & Express.js – API Framework
### MongoDB – Database with optimized queries & indexing
### JWT Authentication – Secure token-based auth
### Swagger (OpenAPI) – API documentation (http://localhost:4000/api-docs)
### In Memory Cache caching for performance
### Docker – Containerized for deployment consistency
## Frontend
### React.js (Vite) – UI Framework
### Tanstack/React Query – API state management
### React Router – Client-side navigation
### Axios – HTTP requests
### Reactstrap – UI components

# 🚀 Features
## 1️⃣ Posts Management
### ✔ Sample Data – Fetches 100 sample posts from JSONPlaceholder on startup
### ✔ CRUD Operations – Create, read, update, and delete posts
### ✔ Search & Pagination – Query by title/body with pagination

## 2️⃣ Post Interaction
### ✔ Like/Unlike – Authenticated users can like or unlike posts
### ✔ Liked Posts Section – Users can view or clear liked posts

## 3️⃣ User Authentication
### ✔ JWT-Based Authentication – Secure login with token-based auth
### ✔ Password Hashing – Uses bcrypt for security
### ✔ Session Persistence – Login persists via localStorage

## 4️⃣ Performance & Scalability
### ✔ MongoDB Aggregations – Optimized data retrieval
### ✔ Indexing & Bulk Operations – Faster database interactions
### ✔ In-Memory Caching – Reduces repeated DB queries

## 5️⃣ Code Quality & Testing
### ✔ Unit Tests (Jest) – Covers core services
### ✔ ESLint & Prettier – Clean & formatted code
### ✔ MVC Architecture – Controllers, Services, Repositories

# Notes: Hardcoded values are used intentionally for easy setup instead of env vars 

# 🛠️ Build Instructions
## Docker and Docker Compose should be installed
### git clone the project
### docker-compose up
### That's it !
### ports used: 3000 for Front End, 4000 for Back End and 27018 for Mongo Db

