# Todo-list Application

A full-stack Todo-list application built with React (Vite), Node.js (Express), MongoDB, and Sequelize ORM. The application features user authentication, session management, and comprehensive API documentation with Swagger.

## Features

- User authentication (register/login)
- Session management with cookies
- Todo-list management (create, read, update, delete)
- User profile management
- REST API with Express
- MongoDB database with Sequelize ORM
- API documentation with Swagger
- Responsive UI with purple and black color scheme

## Project Structure

```
todo-app/
├── client/                 # Frontend (React - Vite)
│   ├── public/             # Static files
│   ├── src/                # Source files
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context API
│   │   ├── pages/          # Pages components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main App component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .eslintrc.js        # ESLint configuration
│   ├── package.json        # Dependencies and scripts
│   └── vite.config.js      # Vite configuration
├── server/                 # Backend (Node.js - Express)
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── swagger/            # Swagger documentation
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies and scripts
│   └── server.js           # Entry point
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/todo-app.git
   cd todo-app
   ```

2. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=todo-app-secret-key
   SESSION_SECRET=todo-app-session-secret
   CLIENT_URL=http://localhost:5173
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=todo_app
   ```

### Database Setup

1. Make sure MongoDB is running on your system
   ```bash
   # Check MongoDB status
   mongo --eval "db.adminCommand('ping')"
   ```

2. If MongoDB is not installed, follow the instructions for your operating system:
   - [Install MongoDB on Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   - [Install MongoDB on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
   - [Install MongoDB on Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. The application will automatically create the necessary collections when it first runs

### Running the Application

1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:5173`
4. Access the API documentation at `http://localhost:5000/api-docs`

## Usage

### Authentication

1. Register a new account from the registration page
2. Login with your credentials
3. Once logged in, you'll be redirected to the dashboard

### Todo Management

1. Navigate to the Todo List page
2. Add new todos using the "Add Todo" button
3. Edit, delete, or mark todos as completed
4. Filter todos by status (All, Active, Completed)
5. View todo details by clicking on a todo item

### User Profile

1. Navigate to the Profile page
2. Update your profile information
3. Change your password

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user information

### Todo List

- `GET /api/todos` - Get all todos for the current user
- `POST /api/todos` - Create a new todo
- `GET /api/todos/:id` - Get a todo by ID
- `PUT /api/todos/:id` - Update a todo by ID
- `DELETE /api/todos/:id` - Delete a todo by ID

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Technologies Used

### Frontend
- React (Vite)
- React Router
- Axios
- TailwindCSS

### Backend
- Node.js
- Express
- MongoDB
- Sequelize ORM
- JSON Web Tokens (JWT)
- Express Session
- Cookie Parser
- Swagger UI Express

## Security Features

1. Password hashing with bcrypt
2. JWT authentication
3. Session management with cookies
4. Protected routes
5. Input validation and sanitization
6. CORS configuration

## Deployment

### Frontend Deployment

1. Build the frontend
   ```bash
   cd client
   npm run build
   ```

2. The build files will be in the `dist` directory, which can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages

### Backend Deployment

1. Deploy to a Node.js hosting service like Heroku, Render, or AWS
2. Set the environment variables in your hosting service dashboard
3. Set up a MongoDB Atlas cluster for the database in production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [JWT Documentation](https://jwt.io/)