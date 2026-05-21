import React, { useState, useEffect } from 'react';

const ClientPayments = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [gcashNumber, setGcashNumber] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchPaymentData();
    }
  }, [user]);

  const fetchPaymentData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const paymentsRes = await fetch('http://localhost:8080/api/payments');
      const paymentsData = await paymentsRes.json();
      
      const userPayments = Array.isArray(paymentsData) 
        ? paymentsData.filter(p => p.userId === user.id)
        : [];
      
      const bookingsRes = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`);
      const bookingsData = await bookingsRes.json();
      const userBookings = Array.isArray(bookingsData) ? bookingsData : [];
      
      const pending = userBookings.filter(b => {
        const isUnpaid = !b.paymentStatus || 
                         b.paymentStatus === 'pending' || 
                         b.paymentStatus === 'unpaid';
        const notCancelled = b.status !== 'cancelled';
        const notConfirmed = b.status !== 'confirmed';
        return isUnpaid && notCancelled && notConfirmed;
      });
      
      setPendingBookings(pending);
      setPayments(userPayments);
      
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
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
    const response = await fetch('http://localhost:8080/api/payments/gcash/process', {
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
        fetchPaymentData(); // Refresh the payments page data only
        setPaymentMessage('');
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

  const viewReceipt = (payment) => {
    setSelectedPayment(payment);
    setShowReceipt(true);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setSelectedPayment(null);
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <span className="badge completed"><i className="fas fa-check-circle"></i> Completed</span>;
      case 'pending':
        return <span className="badge pending"><i className="fas fa-clock"></i> Pending</span>;
      case 'failed':
        return <span className="badge failed"><i className="fas fa-times-circle"></i> Failed</span>;
      default:
        return <span className="badge">{status || 'Pending'}</span>;
    }
  };

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  
  const totalPending = pendingBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);

  return (
    <div className="payments-container">
      <div className="payments-header">
        <div className="header-content">
          <h1><i className="fas fa-credit-card"></i> My Payments</h1>
          <p>Manage your transactions and payment history</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon yellow">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value">₱{totalSpent.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Pending Payments</span>
            <span className="stat-value">₱{totalPending.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Transactions</span>
            <span className="stat-value">{payments.length + pendingBookings.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Secure</span>
            <span className="stat-value">100% Safe</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading payments...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
          <button onClick={fetchPaymentData} className="retry-btn">Try Again</button>
        </div>
      ) : (payments.length === 0 && pendingBookings.length === 0) ? (
        <div className="empty-state">
          <i className="fas fa-receipt"></i>
          <h3>No payments yet</h3>
          <p>Book a tour to see your payment history</p>
          <button className="browse-btn" onClick={() => window.location.href = '/dashboard?page=view-tours'}>
            Browse Tours →
          </button>
        </div>
      ) : (
        <>
          {pendingBookings.length > 0 && (
            <div className="section">
              <div className="section-title">
                <h2><i className="fas fa-clock"></i> Pending Payments</h2>
                <span className="count">{pendingBookings.length}</span>
              </div>
              <div className="pending-grid">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="pending-card">
                    <div className="card-header">
                      <span className="booking-id">{booking.bookingNumber}</span>
                      <span className="due-tag">Due Now</span>
                    </div>
                    <div className="card-body">
                      <div className="detail-row">
                        <span>Tour ID</span>
                        <strong>#{booking.tourId}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Travel Date</span>
                        <strong>{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : '-'}</strong>
                      </div>
                      <div className="detail-row">
                        <span>Amount</span>
                        <strong className="amount">₱{Number(booking.totalAmount).toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="pay-btn" onClick={() => openPaymentModal(booking)}>
                        <i className="fab fa-gcash"></i> Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payments.length > 0 && (
            <div className="section">
              <div className="section-title">
                <h2><i className="fas fa-history"></i> Payment History</h2>
                <span className="count">{payments.length}</span>
              </div>
              <div className="table-wrapper">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Booking</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td className="mono">{payment.paymentNumber}</td>
                        <td>{payment.bookingNumber || '-'}</td>
                        <td className="amount-cell">₱{Number(payment.amount).toLocaleString()}</td>
                        <td><span className="method"><i className="fab fa-gcash"></i> GCash</span></td>
                        <td>{payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}</td>
                        <td>{getStatusBadge(payment.status)}</td>
                        <td>
                          <button className="receipt-btn" onClick={() => viewReceipt(payment)}>
                            <i className="fas fa-receipt"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <i className="fab fa-gcash"></i>
              </div>
              <h2>GCash Payment</h2>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="payment-details">
                <div className="detail">
                  <span>Booking ID:</span>
                  <strong>{selectedBooking.bookingNumber}</strong>
                </div>
                <div className="detail">
                  <span>Amount:</span>
                  <strong className="highlight">₱{Number(selectedBooking.totalAmount).toLocaleString()}</strong>
                </div>
              </div>
              <div className="payment-input">
                <label>GCash Mobile Number</label>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit GCash number"
                  value={gcashNumber}
                  onChange={(e) => setGcashNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
                <small>Enter your GCash registered mobile number</small>
              </div>
              {paymentMessage && (
                <div className={`payment-message ${paymentMessage.includes('✅') ? 'success' : 'error'}`}>
                  {paymentMessage}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="print-btn" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button className="download-btn" onClick={processPayment} disabled={paymentProcessing}>
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

      {/* Receipt Modal */}
      {showReceipt && selectedPayment && (
        <div className="modal-overlay" onClick={closeReceipt}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Payment Receipt</h2>
              <button className="modal-close" onClick={closeReceipt}>✕</button>
            </div>
            <div className="modal-body">
              <div className="receipt-logo">
                <i className="fas fa-plane"></i>
                <h3>Travel&Go</h3>
              </div>
              <div className="receipt-details">
                <div className="detail">
                  <span>Transaction ID:</span>
                  <strong>{selectedPayment.transactionId || selectedPayment.paymentNumber}</strong>
                </div>
                <div className="detail">
                  <span>Payment ID:</span>
                  <strong>{selectedPayment.paymentNumber}</strong>
                </div>
                <div className="detail">
                  <span>Booking ID:</span>
                  <strong>{selectedPayment.bookingNumber || 'N/A'}</strong>
                </div>
                <div className="detail">
                  <span>Amount:</span>
                  <strong className="highlight">₱{Number(selectedPayment.amount).toLocaleString()}</strong>
                </div>
                <div className="detail">
                  <span>Method:</span>
                  <strong>{selectedPayment.paymentMethod || 'GCash'}</strong>
                </div>
                <div className="detail">
                  <span>Date:</span>
                  <strong>{new Date(selectedPayment.paymentDate).toLocaleString()}</strong>
                </div>
                <div className="detail">
                  <span>Status:</span>
                  <strong className="status">{selectedPayment.status}</strong>
                </div>
              </div>
              <div className="receipt-footer">
                <p>Thank you for choosing Travel&Go!</p>
                <small>Official payment receipt</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="print-btn" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print
              </button>
              <button className="download-btn" onClick={() => alert('Coming soon!')}>
                <i className="fas fa-download"></i> Download
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .payments-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
          background: #ffffff;
        }

        .payments-header {
          background: linear-gradient(135deg, #1e1b4b, #2d2a5e);
          border-radius: 24px;
          padding: 32px 40px;
          margin-bottom: 32px;
        }

        .header-content h1 {
          margin: 0;
          font-size: 28px;
          color: #ffd700;
        }

        .header-content p {
          margin: 8px 0 0;
          color: #a5b4fc;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: #f8fafc;
          border-radius: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
          border: 1px solid #e2e8f0;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          border-color: #ffd700;
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .stat-icon.yellow { background: linear-gradient(135deg, #ffd700, #f59e0b); color: white; }
        .stat-icon.orange { background: linear-gradient(135deg, #f97316, #ea580c); color: white; }
        .stat-icon.purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
        .stat-icon.green { background: linear-gradient(135deg, #10b981, #059669); color: white; }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 13px;
          color: #64748b;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
        }

        .section {
          margin-bottom: 40px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-title h2 {
          margin: 0;
          font-size: 20px;
          color: #1e293b;
        }

        .section-title .count {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          color: #64748b;
        }

        .pending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
        }

        .pending-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
        }

        .pending-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08);
          border-color: #ffd700;
        }

        .card-header {
          background: #f8fafc;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
        }

        .booking-id {
          font-family: monospace;
          font-weight: bold;
          color: #1e293b;
        }

        .due-tag {
          background: #fef3c7;
          color: #d97706;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
        }

        .card-body {
          padding: 20px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .detail-row span:first-child {
          color: #64748b;
          font-size: 13px;
        }

        .detail-row strong {
          color: #1e293b;
        }

        .detail-row .amount {
          color: #ef4444;
          font-size: 18px;
        }

        .card-footer {
          padding: 16px 20px;
          border-top: 1px solid #e2e8f0;
        }

        .pay-btn {
          width: 100%;
          background: linear-gradient(135deg, #ffd700, #f59e0b);
          color: #1e293b;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .pay-btn:hover {
          transform: translateY(-1px);
        }

        .table-wrapper {
          background: white;
          border-radius: 20px;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
        }

        .payments-table th,
        .payments-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .payments-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 600;
        }

        .payments-table tr:hover {
          background: #f8fafc;
        }

        .mono {
          font-family: monospace;
          font-size: 12px;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 8px;
          display: inline-block;
          color: #1e293b;
        }

        .amount-cell {
          color: #10b981;
          font-weight: 600;
        }

        .method {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #1e293b;
        }

        .badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.completed { background: #d1fae5; color: #065f46; }
        .badge.pending { background: #fef3c7; color: #92400e; }
        .badge.failed { background: #fee2e2; color: #991b1b; }

        .receipt-btn {
          background: none;
          border: none;
          color: #f59e0b;
          cursor: pointer;
          font-size: 16px;
        }

        .modal-overlay {
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

        .modal {
          background: white;
          border-radius: 24px;
          width: 480px;
          max-width: 90%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          background: linear-gradient(135deg, #ffd700, #f59e0b);
          border-radius: 24px 24px 0 0;
        }

        .modal-icon {
          width: 48px;
          height: 48px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #f59e0b;
        }

        .modal-header h2 {
          margin: 0;
          color: white;
        }

        .modal-close {
          position: absolute;
          right: 20px;
          background: rgba(255,255,255,0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .payment-details {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .payment-input {
          margin-bottom: 20px;
        }

        .payment-input label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #1e293b;
        }

        .payment-input input {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 16px;
        }

        .payment-input small {
          display: block;
          margin-top: 8px;
          color: #64748b;
          font-size: 12px;
        }

        .payment-message {
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          margin-top: 16px;
        }

        .payment-message.success {
          background: #d1fae5;
          color: #065f46;
        }

        .payment-message.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .receipt-logo {
          text-align: center;
          margin-bottom: 24px;
        }

        .receipt-logo i {
          font-size: 48px;
          color: #f59e0b;
        }

        .receipt-logo h3 {
          margin: 8px 0 0;
          color: #1e293b;
        }

        .receipt-details {
          background: #f8fafc;
          border-radius: 16px;
          padding: 16px;
        }

        .detail {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .detail:last-child {
          border-bottom: none;
        }

        .detail span:first-child {
          color: #64748b;
        }

        .detail strong {
          color: #1e293b;
        }

        .highlight {
          color: #f59e0b;
          font-size: 18px;
        }

        .status {
          color: #10b981;
          text-transform: uppercase;
        }

        .receipt-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
        }

        .modal-footer {
          padding: 20px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
        }

        .print-btn, .download-btn {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 500;
        }

        .print-btn {
          background: #f1f5f9;
          color: #1e293b;
          border: none;
        }

        .download-btn {
          background: linear-gradient(135deg, #ffd700, #f59e0b);
          color: white;
          border: none;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: #f8fafc;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
        }

        .empty-state i {
          font-size: 64px;
          color: #cbd5e1;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          color: #1e293b;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: #64748b;
          margin-bottom: 24px;
        }

        .browse-btn {
          background: linear-gradient(135deg, #ffd700, #f59e0b);
          color: white;
          border: none;
          padding: 12px 28px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .loading-state {
          text-align: center;
          padding: 80px;
          background: #f8fafc;
          border-radius: 24px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 3px solid #e2e8f0;
          border-top-color: #f59e0b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-state {
          text-align: center;
          padding: 60px;
          background: #f8fafc;
          border-radius: 24px;
        }

        .error-state i {
          font-size: 48px;
          color: #ef4444;
          margin-bottom: 16px;
        }

        .retry-btn {
          background: linear-gradient(135deg, #ffd700, #f59e0b);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 16px;
        }
      `}</style>
    </div>
  );
};

export default ClientPayments;