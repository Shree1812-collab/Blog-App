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

# Project Structure

Blogapp_frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Header.jsx            # Navbar
│   │   ├── Footer.jsx            # Footer
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Register page
│   │   ├── WriteArticle.jsx      # Create new article
│   │   ├── ArticleByID.jsx       # Single article view
│   │   ├── AuthorArticles.jsx    # Articles by one author
│   │   ├── AuthorDashboard.jsx   # Author's personal dashboard
│   │   ├── AuthorProfile.jsx     # Author profile page
│   │   ├── UserDashboard.jsx     # Regular user dashboard
│   │   ├── UserProfile.jsx       # User profile
│   │   ├── EditArticlePage.jsx   # Edit existing article
│   │   ├── AdminDashboard.jsx    # Admin controls
│   │   ├── ProtectedRoute.jsx    # Route guard for auth
│   │   ├── RootLayout.jsx        # Shared layout wrapper
│   │   └── ErrorBoundary.jsx     # Error handling
│   └── App.js
├── package.json
└── .env
