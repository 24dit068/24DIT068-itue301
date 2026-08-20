import mongoose from 'mongoose'

// ============ TASK 5: Mongoose Schemas with Validation ============

// Task 5: Book Schema
// Fields: title, author, category, isbn, available
const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Task 5: Member Schema
// Fields: name, email, phone, department
const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Task 5: Borrowing Schema
// Fields: memberId, bookId, borrowDate, returnDate, status
// Status must be one of: borrowed, returned, overdue
const BorrowingSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: [true, 'Member ID is required']
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  borrowDate: {
    type: Date,
    required: [true, 'Borrow date is required']
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required']
  },
  status: {
    type: String,
    enum: {
      values: ['borrowed', 'returned', 'overdue'],
      message: 'Status must be one of: borrowed, returned, overdue'
    },
    default: 'borrowed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Create models
export const BookModel = mongoose.model('Book', BookSchema)
export const MemberModel = mongoose.model('Member', MemberSchema)
export const BorrowingModel = mongoose.model('Borrowing', BorrowingSchema)
