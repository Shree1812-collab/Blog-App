# PenPal - Blog App Frontend
A React frontend for a MERN stack blog application where users can read, write, and manage articles.

# Tech Stack
- React - UI library
- React Router DOM - Page routing
- Axios - API calls to backend
- CSS / Inline styles - Styling

# Install dependencies
    npm install

# Create a `.env` file

# Start the app
    npm start

# Features
- User registration and login
- Browse and read articles
- Authors can write, edit, and delete their articles
- Admin dashboard for managing users and content
- Protected routes (only logged-in users can access certain pages)

# Architecture 
User (Browser)
      |
      v
  React App (Frontend - Port 3000)
      |
      |-- React Router --> Page Components
      |                        |
      |                        |--> Home.jsx
      |                        |--> Login.jsx / Register.jsx
      |                        |--> ArticleByID.jsx
      |                        |--> WriteArticle.jsx
      |                        |--> AuthorDashboard.jsx
      |                        |--> AdminDashboard.jsx
      |
      |-- Axios HTTP Request (GET / POST / PUT / DELETE)
      |
      v
  Express Server (Backend - Port 5000)
      |
      |-- Auth Routes     --> /api/auth/login  /api/auth/register
      |-- Article Routes  --> /api/articles
      |-- User Routes     --> /api/users
      |
      v
  MongoDB Database
      |
      |-- Users Collection
      |-- Articles Collection

# Component Flow
RootLayout.jsx  (wraps everything)
      |
      |-- Header.jsx  (Navbar - shown on all pages)
      |
      |-- ProtectedRoute.jsx
      |         |
      |         |--(logged in)--> AuthorDashboard / AdminDashboard / WriteArticle
      |         |
      |         |--(not logged in)--> redirect to Login.jsx
      |
      |-- Public Pages
      |         |
      |         |--> Home.jsx --> ArticleByID.jsx
      |         |--> Login.jsx / Register.jsx
      |         |--> AuthorProfile.jsx --> AuthorArticles.jsx
      |
      |-- Footer.jsx  (shown on all pages)
      |
      |-- ErrorBoundary.jsx  (catches any crashes)
