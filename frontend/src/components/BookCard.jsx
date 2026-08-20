import React from 'react'

// Task 1: BookCard component with props
// This component receives book information as props and displays it
// The availability status has different visual styling
function BookCard({ title, author, category, available }) {
  return (
    <div className="book-card">
      <div className="book-title">{title}</div>
      <div className="book-author"><strong>Author:</strong> {author}</div>
      <div className="book-category"><strong>Category:</strong> {category}</div>
      <div className="availability">
        <span className={available ? 'available' : 'not-available'}>
          {available ? '✓ Available' : '✗ Not Available'}
        </span>
      </div>
    </div>
  )
}

export default BookCard
