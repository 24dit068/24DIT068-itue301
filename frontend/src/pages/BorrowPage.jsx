import React, { useState } from 'react'

// Task 2: React State Management
// This component demonstrates useState hook and controlled components
function BorrowPage() {
  // Task 2: State values for form management
  const [memberName, setMemberName] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [borrowDate, setBorrowDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [submittedData, setSubmittedData] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  // Task 2: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!memberName || !bookTitle || !borrowDate || !returnDate) {
      alert('Please fill in all fields')
      return
    }

    // Create borrowing record object
    const borrowingRecord = {
      memberName,
      bookTitle,
      borrowDate,
      returnDate,
      status: 'borrowed'
    }

    try {
      // Task 3: POST request to Express API
      const response = await fetch('http://localhost:5000/api/v1/borrowings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(borrowingRecord)
      })

      if (response.ok) {
        const result = await response.json()
        setSuccessMessage('Borrowing record created successfully!')
        
        // Task 2: Display submitted data on page as state changes
        setSubmittedData({
          memberName,
          bookTitle,
          borrowDate,
          returnDate
        })

        // Clear form after successful submission
        setTimeout(() => {
          setMemberName('')
          setBookTitle('')
          setBorrowDate('')
          setReturnDate('')
          setSuccessMessage('')
        }, 3000)
      } else {
        alert('Failed to create borrowing record')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating borrowing record: ' + error.message)
    }
  }

  return (
    <div>
      <h1>Borrow a Book</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Member Name:</label>
          <input
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Book Title:</label>
          <input
            type="text"
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="Enter book title"
          />
        </div>

        <div className="form-group">
          <label>Borrow Date:</label>
          <input
            type="date"
            value={borrowDate}
            onChange={(e) => setBorrowDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Return Date:</label>
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>

        <button type="submit">Submit Borrowing Request</button>
      </form>

      {/* Task 2: Display success message */}
      {successMessage && (
        <div className="success">{successMessage}</div>
      )}

      {/* Task 2: Display entered/selected values as state changes */}
      {submittedData && (
        <div className="form-output">
          <h3>Borrowing Record Created:</h3>
          <p><strong>Member Name:</strong> {submittedData.memberName}</p>
          <p><strong>Book Title:</strong> {submittedData.bookTitle}</p>
          <p><strong>Borrow Date:</strong> {submittedData.borrowDate}</p>
          <p><strong>Return Date:</strong> {submittedData.returnDate}</p>
          <p><strong>Status:</strong> Borrowed</p>
        </div>
      )}
    </div>
  )
}

export default BorrowPage
