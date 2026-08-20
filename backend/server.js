import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'
import { BookModel, MemberModel, BorrowingModel } from './models/Schema.js'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env file from backend directory
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 5000

// ============ TASK 3: Middleware ============

// Enable CORS and JSON parsing
app.use(cors())
app.use(bodyParser.json())

// Task 3: Custom request logger middleware
// Logs every request with METHOD, PATH, and TIMESTAMP
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${req.method}] ${req.path} [${timestamp}]`)
  next()
}

// Apply request logger middleware globally
app.use(requestLogger)

// ============ Task 3: In-memory sample data (temporary before MongoDB) ============

let booksData = [
  {
    id: 1,
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    category: 'Computer Science',
    isbn: '978-0262033848',
    available: true
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Development',
    isbn: '978-0132350884',
    available: true
  },
  {
    id: 3,
    title: 'Database Design',
    author: 'C. J. Date',
    category: 'Database',
    isbn: '978-0134685991',
    available: false
  },
  {
    id: 4,
    title: 'Web Development with Node.js',
    author: 'Shelley Powers',
    category: 'Web Development',
    isbn: '978-1449355739',
    available: true
  }
]

let borrowingsData = []
let borrowingIdCounter = 1

// ============ TASK 3: REST API Endpoints ============

// Task 3: GET /api/v1/books - Return all books
app.get('/api/v1/books', (req, res) => {
  try {
    res.status(200).json(booksData)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' })
  }
})

// Task 3: GET /api/v1/borrowings - Return all borrowing records
app.get('/api/v1/borrowings', (req, res) => {
  try {
    res.status(200).json(borrowingsData)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch borrowings' })
  }
})

// Task 3: POST /api/v1/borrowings - Create a new borrowing record
app.post('/api/v1/borrowings', (req, res) => {
  try {
    const { memberName, bookTitle, borrowDate, returnDate, status } = req.body

    // Validate required fields
    if (!memberName || !bookTitle || !borrowDate || !returnDate) {
      return res.status(400).json({ 
        error: 'Missing required fields: memberName, bookTitle, borrowDate, returnDate' 
      })
    }

    // Create new borrowing record
    const newBorrowing = {
      id: borrowingIdCounter++,
      memberName,
      bookTitle,
      borrowDate,
      returnDate,
      status: status || 'borrowed'
    }

    borrowingsData.push(newBorrowing)
    
    // Task 3: Return 201 status for successful POST
    res.status(201).json({
      message: 'Borrowing record created successfully',
      borrowing: newBorrowing
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create borrowing record' })
  }
})

// ============ TASK 5: MongoDB Connection ============

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('✓ MongoDB connected successfully')
    } else {
      console.log('⚠ MONGO_URI not set - Running with in-memory data only')
    }
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message)
  }
}

connectDB()

// ============ TASK 5: MongoDB Operations ============

// Endpoint to demonstrate MongoDB operations
app.post('/api/v1/books/mongodb', async (req, res) => {
  try {
    const { title, author, category, isbn, available } = req.body

    if (!title || !author || !category) {
      return res.status(400).json({
        error: 'Missing required fields: title, author, category'
      })
    }

    const book = new BookModel({
      title,
      author,
      category,
      isbn,
      available: available || true
    })

    await book.save()
    res.status(201).json({
      message: 'Book created in MongoDB',
      book
    })
  } catch (error) {
    res.status(500).json({
      error: 'Validation failed',
      details: error.message
    })
  }
})

// Endpoint to create member in MongoDB
app.post('/api/v1/members/mongodb', async (req, res) => {
  try {
    const { name, email, phone, department } = req.body

    if (!name || !email || !department) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, department'
      })
    }

    const member = new MemberModel({
      name,
      email,
      phone,
      department
    })

    await member.save()
    res.status(201).json({
      message: 'Member created in MongoDB',
      member
    })
  } catch (error) {
    res.status(500).json({
      error: 'Validation failed',
      details: error.message
    })
  }
})

// Endpoint to create borrowing record in MongoDB
app.post('/api/v1/borrowings/mongodb', async (req, res) => {
  try {
    const { memberId, bookId, borrowDate, returnDate, status } = req.body

    if (!memberId || !bookId || !borrowDate || !returnDate) {
      return res.status(400).json({
        error: 'Missing required fields: memberId, bookId, borrowDate, returnDate'
      })
    }

    const borrowing = new BorrowingModel({
      memberId,
      bookId,
      borrowDate,
      returnDate,
      status: status || 'borrowed'
    })

    await borrowing.save()
    res.status(201).json({
      message: 'Borrowing record created in MongoDB',
      borrowing
    })
  } catch (error) {
    res.status(500).json({
      error: 'Validation failed',
      details: error.message
    })
  }
})

// ============ TASK 3: Global Error-Handling Middleware ============

// 404 - Not Found
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  })
})

// Task 3: Global error handler (last middleware)
// Returns structured JSON response instead of exposing raw error stack
app.use((error, req, res, next) => {
  console.error('Error:', error)
  
  res.status(error.status || 500).json({
    error: 'Internal Server Error',
    message: error.message || 'Something went wrong on the server',
    path: req.path
  })
})

// ============ Start Server ============

app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`)
  console.log(`✓ API endpoints:`)
  console.log(`  GET  http://localhost:${PORT}/api/v1/books`)
  console.log(`  GET  http://localhost:${PORT}/api/v1/borrowings`)
  console.log(`  POST http://localhost:${PORT}/api/v1/borrowings`)
  console.log(`  POST http://localhost:${PORT}/api/v1/books/mongodb (MongoDB)`)
  console.log(`  POST http://localhost:${PORT}/api/v1/members/mongodb (MongoDB)`)
  console.log(`  POST http://localhost:${PORT}/api/v1/borrowings/mongodb (MongoDB)`)
})

export default app
