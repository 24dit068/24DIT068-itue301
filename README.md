# Library Book Management System

## Project Description
A full-stack web application for managing library books, members, and borrowing records using React, Express.js, and MongoDB.

## Tech Stack
- **Frontend**: React + Vite + React Router
- **Backend**: Express.js + Node.js
- **Database**: MongoDB + Mongoose
- **API Communication**: Axios / Fetch

## Project Structure
```
itue-exam-[roll-number]-[batch]/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   └── Navigation.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── BooksPage.jsx
│   │   │   └── BorrowPage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── models/
│   │   └── Schema.js
│   ├── server.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Features
- ✓ **React Component Architecture** - Reusable components (BookCard, Navigation)
- ✓ **React Routing** - Navigation with React Router (/, /books, /borrow)
- ✓ **State Management** - useState for form handling and API states
- ✓ **Express REST API** - Multiple endpoints with proper HTTP status codes
- ✓ **Custom Middleware** - Request logger and error handler
- ✓ **API Consumption** - Fetch books from backend in React
- ✓ **Mongoose Schemas** - Book, Member, Borrowing with validation
- ✓ **MongoDB Integration** - Document storage with references

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/itue301-exam-[roll-number]-[batch].git
cd itue301-exam-[roll-number]-[batch]
```

### 2. Backend Setup

#### Step 1: Install Dependencies
```bash
cd backend
npm install
```

#### Step 2: Create .env file
Copy `.env.example` to `.env` and update the MongoDB URI:
```bash
cp ../.env.example ../.env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/library-db
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/library-db
```

#### Step 3: Start Backend Server
```bash
npm start
```

The backend will start on `http://localhost:5000`

You should see:
```
✓ Server running on http://localhost:5000
✓ API endpoints:
  GET  http://localhost:5000/api/v1/books
  GET  http://localhost:5000/api/v1/borrowings
  POST http://localhost:5000/api/v1/borrowings
  ...
```

### 3. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

#### Step 2: Start Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

---

## API Endpoints

### For In-Memory Testing (No MongoDB)
```
GET  /api/v1/books          - Get all books
GET  /api/v1/borrowings     - Get all borrowing records
POST /api/v1/borrowings     - Create borrowing record
```

### For MongoDB Testing
```
POST /api/v1/books/mongodb        - Create book in MongoDB
POST /api/v1/members/mongodb      - Create member in MongoDB
POST /api/v1/borrowings/mongodb   - Create borrowing in MongoDB
```

---

## Testing API Endpoints

### Using Thunder Client or Postman

#### Test 1: Get All Books
```
Method: GET
URL: http://localhost:5000/api/v1/books
```

#### Test 2: Create Borrowing Record
```
Method: POST
URL: http://localhost:5000/api/v1/borrowings
Content-Type: application/json

Body:
{
  "memberName": "John Doe",
  "bookTitle": "Clean Code",
  "borrowDate": "2026-08-20",
  "returnDate": "2026-09-03",
  "status": "borrowed"
}
```

#### Test 3: Get All Borrowings
```
Method: GET
URL: http://localhost:5000/api/v1/borrowings
```

#### Test 4: Create Book in MongoDB (Requires .env)
```
Method: POST
URL: http://localhost:5000/api/v1/books/mongodb
Content-Type: application/json

Body:
{
  "title": "The Pragmatic Programmer",
  "author": "David Thomas",
  "category": "Programming",
  "isbn": "978-0201616224",
  "available": true
}
```

#### Test 5: Validation Failure Example
```
Method: POST
URL: http://localhost:5000/api/v1/borrowings
Content-Type: application/json

Body:
{
  "memberName": "Jane Smith"
  // Missing: bookTitle, borrowDate, returnDate
}

Response:
{
  "error": "Missing required fields: memberName, bookTitle, borrowDate, returnDate"
}
```

---

## MongoDB Schema Details

### Book Schema
```javascript
{
  title: String (required),
  author: String (required),
  category: String (required),
  isbn: String (unique),
  available: Boolean (default: true)
}
```

### Member Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  department: String (required)
}
```

### Borrowing Schema
```javascript
{
  memberId: ObjectId (Reference to Member),
  bookId: ObjectId (Reference to Book),
  borrowDate: Date (required),
  returnDate: Date (required),
  status: Enum ['borrowed', 'returned', 'overdue'] (default: 'borrowed')
}
```

---

## Environment Variables

Create a `.env` file in the root directory (same level as backend folder):

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/library-db

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Note**: Do NOT commit `.env` file. Only commit `.env.example`.

---

## React Components Guide

### Navigation Component
- Shows links to Home, Books, and Borrow pages
- Uses React Router Link for navigation without page reload

### BookCard Component
- Props: `title`, `author`, `category`, `available`
- Visual distinction for available/unavailable books
- Reusable across different pages

### BooksPage Component
- Fetches books from `/api/v1/books` on mount using useEffect
- Manages three states: `books`, `loading`, `error`
- Shows loading indicator while fetching
- Shows error message if API call fails
- Displays book data from API response

### BorrowPage Component
- Form with controlled inputs (value + onChange)
- State management with useState
- Displays entered values in real-time
- Submits borrowing record to backend
- Shows success message after submission

---

## Troubleshooting

### Frontend won't connect to backend?
- Make sure backend is running on port 5000
- Check CORS is enabled in Express
- Verify `proxy` setting in `vite.config.js`

### MongoDB connection fails?
- Check if MongoDB service is running
- Verify MONGO_URI in `.env` is correct
- For MongoDB Atlas, check IP whitelist

### Port already in use?
- Backend: Change PORT in `.env`
- Frontend: Change port in `vite.config.js`

### Module not found errors?
- Run `npm install` in both frontend and backend folders
- Delete `node_modules` and run `npm install` again

---

## Submission Checklist

- ✓ Frontend runs on `http://localhost:3000`
- ✓ Backend runs on `http://localhost:5000`
- ✓ GET /api/v1/books returns books
- ✓ POST /api/v1/borrowings creates record
- ✓ Mongoose schemas defined
- ✓ MongoDB operations working (with .env)
- ✓ Request logger middleware logs requests
- ✓ Error handler returns JSON responses
- ✓ React Router navigation works
- ✓ BookCard component displays all props
- ✓ BooksPage loads data from API
- ✓ BorrowPage form with controlled inputs
- ✓ .env.example committed (not .env)
- ✓ README.md includes all instructions

---

## Additional Notes

1. **For the Viva**: Be ready to explain:
   - Component props flow and composition
   - useEffect and API data fetching
   - How middleware works in Express
   - Mongoose schema validation
   - Why .env should not be committed

2. **Common Questions Your Teacher Might Ask**:
   - "Why do we need useEffect?" → To fetch data when component mounts
   - "How does the middleware work?" → It runs for every request in sequence
   - "What's the difference between borrowed and returned status?" → Status tracks borrowing lifecycle

3. **Easy Improvements** (if you have extra time):
   - Add more books to the sample data
   - Add a "Delete Book" button
   - Add filtering by category
   - Add date validation (returnDate > borrowDate)

---

## Author
[Your Name]  
CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY  
CSPIT - Information Technology  
Semester 5th | AY 2026-27
