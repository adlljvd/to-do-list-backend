# To-Do List Backend

A server-side application for a to-do list app built with Express.js and Mongoose.

## 🚀 Features

- User authentication (register, login)
- Task management (CRUD operations)
- Category management
- Task filtering by category, status, and priority
- Role-based default categories
- Custom category colors

## 💻 Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- Bcrypt

## 🛠️ Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Set up environment variables in `.env`

   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/todo-list-app
   SECRET_KEY=<your-secret-key>
   ```

4. Run the server
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication Routes

#### Register

```json
POST /register

# Request Body
{
    "email": "user@mail.com",
    "password": "password123",
    "role": "seller"  // or "buyer"
}

# Response (201)
{
    "message": "User registered successfully",
    "data": {
        "id": "user_id",
        "email": "user@mail.com",
        "role": "seller"
    }
}
```

#### Login

```json
POST /login

# Request Body
{
    "email": "user@mail.com",
    "password": "password123"
}

# Response (200)
{
    "message": "Login successful",
    "data": {
        "access_token": "jwt_token"
    }
}
```

### Task Routes

> All routes require Authorization header: `Bearer <token>`

#### Get All Tasks

```json
GET /tasks

# Response (200)
{
    "message": "Tasks retrieved successfully",
    "data": [
        {
            "id": "task_id",
            "title": "Task 1",
            "description": "Description",
            "time": "10:00",
            "date": "2025-01-12",
            "status": "pending",
            "priority": "high",
            "category": {
                "name": "Work",
                "color": "#FF5733"
            }
        }
    ]
}
```

#### Create Task

```json
POST /tasks

# Request Body
{
    "title": "Task 1",
    "description": "Description",
    "dueDate": "2025-01-12",
    "time": "10:00",
    "status": "pending",
    "priority": "high",
    "category": "Work"
}

# Response (201)
{
    "message": "Task created successfully",
    "data": {
        "id": "task_id",
        "title": "Task 1",
        ...
    }
}
```

#### Update Task

```json
PUT /tasks/:id

# Request Body (all fields optional)
{
    "title": "Updated Task",
    "description": "Updated Description",
    "dueDate": "2025-01-13",
    "time": "11:00",
    "status": "completed",
    "priority": "medium",
    "category": "Personal"
}

# Response (200)
{
    "message": "Task updated successfully",
    "data": {
        "id": "task_id",
        "title": "Updated Task",
        ...
    }
}
```

#### Delete Task

```json
DELETE /tasks/:id

# Response (200)
{
    "message": "Task deleted successfully"
}
```

#### Filter Tasks

```json
GET /tasks/category/:category
GET /tasks/status/:status
GET /tasks/priority/:priority

# Response (200)
{
    "message": "Tasks retrieved successfully",
    "data": [...]
}
```

### Category Routes

> All routes require Authorization header: `Bearer <token>`

#### Get All Categories

```json
GET /categories

# Response (200)
{
    "message": "Categories retrieved successfully",
    "data": [
        {
            "name": "Work",
            "color": "#FF5733",
            "isDefault": true
        }
    ]
}
```

#### Add Category

```json
POST /categories

# Request Body
{
    "name": "Shopping",
    "color": "#33FF57"  // optional
}

# Response (201)
{
    "message": "Category added successfully",
    "data": [...]
}
```

#### Update Category

```json
PUT /categories/:name

# Request Body (all fields optional)
{
    "name": "New Name",
    "color": "#5733FF"
}

# Response (200)
{
    "message": "Category updated successfully",
    "data": [...]
}
```

#### Delete Category

```json
DELETE /categories/:name

# Response (200)
{
    "message": "Category deleted successfully",
    "data": [...]
}
```

### Error Responses

```json
# 400 Bad Request
{
    "message": "Invalid input data"
}

# 401 Unauthorized
{
    "message": "Please login first!"
}

# 404 Not Found
{
    "message": "Data not found"
}

# 500 Internal Server Error
{
    "message": "Internal server error"
}
```

## 📋 Default Categories

### Seller Role

- Listing
- Bidding
- Winner
- Delivery

### Buyer Role

- Wishlist
- Bidding
- Payment
- Review
