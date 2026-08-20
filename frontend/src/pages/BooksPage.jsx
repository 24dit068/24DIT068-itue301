import React, { useState, useEffect } from 'react'
import BookCard from '../components/BookCard'

// Task 4: REST API Consumption in React
// This component fetches books from the Express API
// It manages three states: data, loading, error
function BooksPage() {
  // Task 4: Three state values for API consumption
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Task 4: useEffect hook - API call on component mount
  useEffect(() => {
    fetchBooks()
  }, [])

  // Function to fetch books from Express API
  const fetchBooks = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:5000/api/v1/books')
      
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }

      const data = await response.json()
      setBooks(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  // Task 4: Display loading message
  if (loading) {
    return <div className="loading">Loading books... Please wait</div>
  }

  // Task 4: Display error message
  if (error) {
    return <div className="error">Error: {error}</div>
  }

  // Task 4: Display books from API response (not hardcoded)
  return (
    <div>
      <h1>Available Books</h1>
      <p>Total books: {books.length}</p>
      <div className="books-grid">
        {books.map((book, index) => (
          <BookCard
            key={index}
            title={book.title}
            author={book.author}
            category={book.category}
            available={book.available}
          />
        ))}
      </div>
      {books.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No books available</p>
      )}
    </div>
  )
}

export default BooksPage
