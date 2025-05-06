# Todo-list Application

A full-stack Todo-list application built with React (Vite), Node.js (Express), and MongoDB Atlas. The application features user authentication, session management, and comprehensive API documentation with Swagger.

## Features

- User authentication (register/login)
- Session management with cookies
- Todo-list management (create, read, update, delete)
- User profile management
- REST API with Express
- MongoDB Atlas cloud database integration
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
- npm or yarn
- MongoDB Atlas account

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
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   JWT_SECRET=todo-app-secret-key
   SESSION_SECRET=todo-app-session-secret
   CLIENT_URL=http://localhost:5173
   ```

   - Replace the MongoDB URI with your actual MongoDB Atlas connection string

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient for development)
3. Set up a database user with read/write permissions
4. Configure network access (allow access from your IP address or from anywhere for development)
5. Get your connection string from the "Connect" button on your cluster dashboard
6. Replace the placeholders in the connection string with your actual credentials

### Running the Application

1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```
   You should see "MongoDB Atlas connected successfully" in the console

2. Start the frontend development server
   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:5173`
4. Access the API documentation at `http://localhost:5000/api-docs`

## API Design

The application provides a RESTful API with the following endpoints:

### Authentication

| Method | Endpoint | Description | Request Body | Response | Authentication |
|--------|----------|-------------|--------------|----------|---------------|
| POST | `/api/auth/register` | Register a new user | `{ username, email, password, firstName?, lastName? }` | `{ message, user, token }` | No |
| POST | `/api/auth/login` | Login a user | `{ email, password }` | `{ message, user, token }` | No |
| GET | `/api/auth/logout` | Logout a user | - | `{ message }` | No |
| GET | `/api/auth/me` | Get current user | - | `{ user }` | Yes |

### Todo Management

| Method | Endpoint | Description | Request Body | Response | Authentication |
|--------|----------|-------------|--------------|----------|---------------|
| GET | `/api/todos` | Get all todos for current user | - | `{ todos: [Todo] }` | Yes |
| POST | `/api/todos` | Create a new todo | `{ title, description?, dueDate?, priority? }` | `{ message, todo }` | Yes |
| GET | `/api/todos/:id` | Get a todo by ID | - | `{ todo }` | Yes |
| PUT | `/api/todos/:id` | Update a todo | `{ title?, description?, completed?, dueDate?, priority? }` | `{ message, todo }` | Yes |
| DELETE | `/api/todos/:id` | Delete a todo | - | `{ message }` | Yes |

### User Profile

| Method | Endpoint | Description | Request Body | Response | Authentication |
|--------|----------|-------------|--------------|----------|---------------|
| GET | `/api/users/profile` | Get user profile | - | `{ user }` | Yes |
| PUT | `/api/users/profile` | Update user profile | `{ username?, email?, firstName?, lastName?, password? }` | `{ message, user }` | Yes |

### Data Models

#### User Model

```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,  // Hashed
  firstName: String, // Optional
  lastName: String,  // Optional
  createdAt: Date,
  updatedAt: Date
}
```

#### Todo Model

```javascript
{
  _id: ObjectId,
  title: String,
  description: String, // Optional
  completed: Boolean,  // Default: false
  dueDate: Date,       // Optional
  priority: String,    // "low", "medium", or "high", Default: "medium"
  user: ObjectId,      // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Authentication

The API uses JWT (JSON Web Token) for authentication. After a successful login or registration, the server:

1. Returns a JWT token in the response
2. Sets the token as an HTTP-only cookie
3. Establishes a session

For protected endpoints, include the token in one of these ways:
- As a cookie (set automatically by the browser)
- In an Authorization header: `Authorization: Bearer <token>`

### Error Handling

All API endpoints return appropriate HTTP status codes:

- `200/201`: Success
- `400`: Bad request or validation error
- `401`: Unauthorized (invalid or missing token)
- `404`: Resource not found
- `500`: Server error

Error responses have this format:
```javascript
{
  message: "Error description",
  errors: [...]  // For validation errors
}
```

## After Successfully Connecting to MongoDB Atlas

Here are the next steps:

### 1. Register an Account on the App

1. Open your browser and navigate to `http://localhost:5173`
2. Click on "Register" or navigate to the registration page
3. Create a new account by providing:
   - Username
   - Email
   - Password
   - (Optional) First name and last name
4. Submit the form to create your account

### 2. Login to the App

1. After registration, you'll be redirected to the login page (or click "Login")
2. Enter your email and password
3. Click "Login" to authenticate
4. Upon successful login, you'll be redirected to the dashboard

### 3. Create Your First Todo

1. From the dashboard, click on "Todo List" in the navigation menu
2. Click the "+ Add Todo" button
3. Fill in the todo details:
   - Title (required)
   - Description (optional)
   - Due date (optional)
   - Priority (low, medium, high)
4. Click "Add Todo" to create your first task
5. Your new todo will appear in the list

### 4. Manage Your Todos

- **View Todo Details**: Click on a todo to expand its details
- **Edit Todo**: Click the edit (pencil) icon to modify a todo
- **Delete Todo**: Click the delete (trash) icon to remove a todo
- **Mark as Complete**: Click the checkbox next to a todo to toggle its completion status
- **Filter Todos**: Use the "All", "Active", and "Completed" buttons to filter your todos

### 5. Update Your Profile

1. Click on "Profile" in the navigation menu
2. View your profile information
3. Click "Update Profile" to open the profile editor
4. Update your information as needed:
   - Username
   - Email
   - First name
   - Last name
   - Password (leave blank to keep current)
5. Click "Update Profile" to save your changes

## Troubleshooting

- **MongoDB Connection Issues**: Double-check your connection string and make sure your IP address is in the allowed list in MongoDB Atlas
- **API Errors**: Check the server logs for detailed error messages
- **Frontend Errors**: Check the browser console for JavaScript errors

## Deployment

When you're ready to deploy your application:

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the backend to a hosting service like Heroku, Render, or AWS

3. Make sure to set the environment variables in your hosting service dashboard

## License

This project is licensed under the MIT License.