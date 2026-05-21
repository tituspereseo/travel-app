import React, { useState, useEffect } from 'react';

const ClientBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [gcashNumber, setGcashNumber] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/user/${user?.id}`);
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(booking.travelDate) > new Date();
    if (filter === 'past') return new Date(booking.travelDate) < new Date();
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      if (data.success) {
        alert('Booking cancelled successfully!');
        fetchBookings();
      } else {
        alert('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Network error. Please try again.');
    }
  };

  const openPaymentModal = (booking) => {
    setSelectedBooking(booking);
    setGcashNumber('');
    setPaymentMessage('');
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!gcashNumber || gcashNumber.length < 10) {
      setPaymentMessage('Please enter a valid GCash number (10 digits)');
      return;
    }

    setPaymentProcessing(true);
    setPaymentMessage('');

    try {
      const response = await fetch(`http://localhost:8080/api/payments/gcash/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          phoneNumber: gcashNumber,
          amount: selectedBooking.totalAmount
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPaymentMessage(`✅ Payment successful! Reference: ${data.referenceNumber}`);
        setTimeout(() => {
          setShowPaymentModal(false);
          fetchBookings();
        }, 2000);
      } else {
        setPaymentMessage('❌ Payment failed: ' + data.error);
      }
    } catch (error) {
      setPaymentMessage('❌ Network error. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'confirmed': return <span className="status-badge confirmed"><i className="fas fa-check-circle"></i> Confirmed</span>;
      case 'pending': return <span className="status-badge pending"><i className="fas fa-clock"></i> Pending</span>;
      case 'cancelled': return <span className="status-badge cancelled"><i className="fas fa-times-circle"></i> Cancelled</span>;
      default: return <span className="status-badge">{status}</span>;
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === 'completed' || paymentStatus === 'paid') {
      return <span className="payment-badge paid"><i className="fas fa-check-circle"></i> Paid</span>;
    }
    return <span className="payment-badge unpaid"><i className="fas fa-clock"></i> Unpaid</span>;
  };

  return (
    <div className="client-bookings">
      <div className="bookings-header">
        <h1><i className="fas fa-calendar-check"></i> My Bookings</h1>
        <p>View and manage all your tour bookings</p>
      </div>

      <div className="booking-filters">
        <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All Bookings ({bookings.length})
        </button>
        <button className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')}>
          Upcoming
        </button>
        <button className={`filter-tab ${filter === 'past' ? 'active' : ''}`} onClick={() => setFilter('past')}>
          Past
        </button>
        <button className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`} onClick={() => setFilter('cancelled')}>
          Cancelled
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading your bookings...</div>
      ) : error ? (
        <div className="error-message" style={{textAlign: 'center', padding: '40px', color: '#dc2626'}}>
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchBookings} className="retry-btn">Retry</button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="no-bookings">
          <i className="fas fa-calendar-times"></i>
          <h3>No bookings found</h3>
          <p>Start exploring tours and book your next adventure!</p>
          <button className="explore-tours-btn" onClick={() => window.location.href = '/dashboard?page=view-tours'}>
            Explore Tours →
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: '#ffd700'
                }}>
                  <i className="fas fa-ticket-alt"></i>
                </div>
              </div>
              <div className="booking-details">
                <div className="booking-header">
                  <h3>Booking #{booking.bookingNumber}</h3>
                  <div className="booking-badges">
                    {getStatusBadge(booking.status)}
                    {getPaymentBadge(booking.paymentStatus)}
                  </div>
                </div>
                <p className="booking-location">
                  <i className="fas fa-map-marker-alt"></i> Tour #{booking.tourId}
                </p>
                <div className="booking-info-grid">
                  <div className="info-item">
                    <label>Travel Date</label>
                    <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Guests</label>
                    <span>{booking.guests} person(s)</span>
                  </div>
                  <div className="info-item">
                    <label>Total Amount</label>
                    <span className="amount">₱{Number(booking.totalAmount).toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Booked On</label>
                    <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {booking.status === 'pending' && booking.paymentStatus !== 'completed' && (
                  <div className="booking-actions">
                    <button className="btn-cancel" onClick={() => cancelBooking(booking.id)}>
                      Cancel Booking
                    </button>
                    <button className="btn-pay" onClick={() => openPaymentModal(booking)}>
                      <i className="fab fa-gcash"></i> Pay Now
                    </button>
                  </div>
                )}
                {booking.status === 'cancelled' && (
                  <div className="booking-note">
                    <small><i className="fas fa-info-circle"></i> This booking has been cancelled</small>
                  </div>
                )}
                {booking.paymentStatus === 'completed' && (
                  <div className="booking-note success">
                    <small><i className="fas fa-check-circle"></i> Payment completed! Your booking is confirmed.</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="payment-modal-header">
              <h2><i className="fab fa-gcash"></i> GCash Payment</h2>
              <button className="payment-modal-close" onClick={() => setShowPaymentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="payment-modal-body">
              <div className="payment-booking-details">
                <div className="detail-row">
                  <span>Booking ID:</span>
                  <strong>{selectedBooking.bookingNumber}</strong>
                </div>
                <div className="detail-row">
                  <span>Amount to Pay:</span>
                  <strong className="amount">₱{Number(selectedBooking.totalAmount).toLocaleString()}</strong>
                </div>
              </div>

              <div className="payment-input-group">
                <label>GCash Mobile Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit GCash number"
                  value={gcashNumber}
                  onChange={(e) => setGcashNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="gcash-input"
                />
                <small>Enter your GCash registered mobile number</small>
              </div>

              {paymentMessage && (
                <div className={`payment-message ${paymentMessage.includes('✅') ? 'success' : 'error'}`}>
                  {paymentMessage}
                </div>
              )}
            </div>

            <div className="payment-modal-footer">
              <button className="btn-cancel-modal" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-pay-modal" 
                onClick={processPayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? (
                  <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                ) : (
                  <><i className="fab fa-gcash"></i> Pay Now</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .booking-badges {
          display: flex;
          gap: 8px;
        }
        .payment-badge.paid {
          background: #10b981;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
        }
        .payment-badge.unpaid {
          background: #f59e0b;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
        }
        .btn-pay {
          background: linear-gradient(135deg, #00b4db, #0083b0);
          color: white;
          border: none;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-pay:hover {
          transform: translateY(-2px);
        }
        .payment-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .payment-modal-container {
          background: white;
          border-radius: 16px;
          width: 400px;
          max-width: 90%;
        }
        .payment-modal-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .payment-modal-header h2 {
          margin: 0;
          color: #00b4db;
          font-size: 20px;
        }
        .payment-modal-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .payment-modal-body {
          padding: 20px;
        }
        .payment-booking-details {
          background: #f8fafc;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .detail-row .amount {
          color: #00b4db;
          font-weight: bold;
        }
        .payment-input-group {
          margin-bottom: 20px;
        }
        .payment-input-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .gcash-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 16px;
        }
        .payment-message {
          padding: 12px;
          border-radius: 8px;
          text-align: center;
        }
        .payment-message.success {
          background: #d1fae5;
          color: #065f46;
        }
        .payment-message.error {
          background: #fee2e2;
          color: #991b1b;
        }
        .payment-modal-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }
        .btn-cancel-modal {
          padding: 10px 20px;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-pay-modal {
          padding: 10px 20px;
          background: linear-gradient(135deg, #00b4db, #0083b0);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .btn-pay-modal:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .booking-note.success {
          background: #d1fae5;
          color: #065f46;
          padding: 8px 12px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default ClientBookings;