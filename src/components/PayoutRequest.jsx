import { useState, useEffect } from 'react'
import axios from 'axios'

function PayoutRequest() {
  // State for tabs
  const [activeTab, setActiveTab] = useState('request')
  
  // State for payout request
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
  const [successMessage, setSuccessMessage] = useState('')
  
  // State for payout history
  const [payouts, setPayouts] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  
  // State for loading and errors
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // State for balance
  const [balance, setBalance] = useState(0)
  
  // API configuration
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  const authToken = localStorage.getItem('token') || ''
  
  // Fetch payout history
  const fetchPayoutHistory = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.get(`${baseUrl}/royalties`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
      setPayouts(response.data)
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch payout history'
      setError(errorMessage)
      console.error('Error fetching payout history:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch balance
  const fetchBalance = async () => {
    try {
      // Fetch from profile API instead
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Extract wallet balance from profile response
      const { walletBalance } = response.data;
      setBalance(walletBalance || 0);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  }
  
  // Submit payout request
  const submitPayoutRequest = async (e) => {
    e.preventDefault()
    
    // Add minimum amount validation
    if (!amount || isNaN(amount) || Number(amount) < 10) {
      setError('Minimum payout amount is ₹10')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${baseUrl}/royalties/request`, {
        amount: Number(amount),
        paymentMethod: paymentMethod
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
      
      setSuccessMessage('Payout request submitted successfully!')
      setAmount('')
      // Refresh payout history after successful submission
      await fetchPayoutHistory()
      await fetchBalance()
      
      setTimeout(() => setSuccessMessage(''), 3000)
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit payout request'
      setError(errorMessage)
      console.error('Submission error:', err.response?.data)
    } finally {
      setLoading(false)
    }
  }
  
  // Filtered payouts based on status
  const filteredPayouts = filterStatus === 'all' 
    ? payouts 
    : payouts.filter(payout => payout.status.toLowerCase() === filterStatus.toLowerCase())
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  // Format amount for display
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Get CSS class for status badges
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-success'
      case 'pending':
        return 'bg-warning'
      case 'rejected':
        return 'bg-danger'
      default:
        return 'bg-secondary'
    }
  }
  
  // Fetch payout history when tab changes
  useEffect(() => {
    fetchBalance()
    const abortController = new AbortController()
    
    if (activeTab === 'history') {
      fetchPayoutHistory()
    }
    return () => abortController.abort()
  }, [activeTab])
  
  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <h4 className="fw-bold py-3 mb-4">
        <span className="text-muted fw-light">Earnings /</span> Royalty Payouts
      </h4>
      
      <div className="row">
        {/* Balance Cards */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div className="content-left">
                  <span className="fw-medium d-block mb-1">Available Balance</span>
                  <h3 className="card-title mb-1 text-primary">
                    {formatAmount(balance)}
                  </h3>
                  <small className="text-muted">Available for withdrawal</small>
                </div>
                {/* <div className="avatar flex-shrink-0 bg-primary bg-opacity-10 p-3 rounded"> */}
                  <i className="bx bx-wallet text-primary fs-3"></i>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'request' ? 'active' : ''}`}
                    onClick={() => setActiveTab('request')}
                    role="tab"
                    aria-selected={activeTab === 'request'}
                  >
                    <i className="bx bx-money-withdraw me-2"></i>
                    Request Payout
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                    role="tab"
                    aria-selected={activeTab === 'history'}
                  >
                    <i className="bx bx-history me-2"></i>
                    Payout History
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="card-body">
              {/* Alert Messages */}
              {error && (
                <div className="alert alert-danger alert-dismissible mb-4" role="alert">
                  <div className="d-flex">
                    <i className="bx bx-error-circle fs-5 me-2"></i>
                    <div>{error}</div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success alert-dismissible mb-4" role="alert">
                  <div className="d-flex">
                    <i className="bx bx-check-circle fs-5 me-2"></i>
                    <div>{successMessage}</div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setSuccessMessage('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}
              
              {/* Request Payout Tab */}
              {activeTab === 'request' && (
                <div className="tab-pane active">
                  <h5 className="mb-4">Request a Payout</h5>
                  
                  <form onSubmit={submitPayoutRequest} className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="amount" className="form-label">Amount</label>
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input
                          type="number"
                          className="form-control"
                          id="amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          required
                          min="10"
                          step="0.01"
                          disabled={loading}
                        />
                      </div>
                      <div className="form-text">Minimum payout amount is ₹10</div>
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                      <select
                        className="form-select"
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={loading}
                      >
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="crypto">Cryptocurrency</option>
                        <option value="check">Check</option>
                      </select>
                    </div>
                    
                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-send me-2"></i>
                            Request Payout
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <div className="alert alert-info mt-4 mb-0">
                    <div className="d-flex">
                      <i className="bx bx-info-circle fs-5 me-2"></i>
                      <div>
                        <p className="mb-0">Payouts are processed within 2-3 business days.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payout History Tab */}
              {activeTab === 'history' && (
                <div className="tab-pane active">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Payout History</h5>
                    
                    <div className="form-group mb-0" style={{ width: '200px' }}>
                      <select
                        className="form-select"
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        disabled={loading}
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading payout history...</span>
                      </div>
                    </div>
                  ) : filteredPayouts.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="bx bx-receipt fs-1 text-muted"></i>
                      </div>
                      <h6 className="text-muted">
                        {payouts.length === 0 
                          ? 'No payout records found.' 
                          : 'No payouts match the selected filter.'}
                      </h6>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover border-top">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Transaction ID</th>
                          </tr>
                        </thead>
                        <tbody className="table-border-bottom-0">
                          {filteredPayouts.map((payout) => (
                            <tr key={payout._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2 bg-label-primary">
                                    <span className="avatar-initial rounded-circle">
                                      <i className="bx bx-calendar"></i>
                                    </span>
                                  </div>
                                  <span>{formatDate(payout.createdAt)}</span>
                                </div>
                              </td>
                              <td>
                                <strong>{formatAmount(payout.amount)}</strong>
                              </td>
                              <td>
                                <span className="text-capitalize">
                                  {payout.paymentMethod.replace('_', ' ')}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${getStatusClass(payout.status)}`}>
                                  {payout.status}
                                </span>
                              </td>
                              <td>
                                <span className="text-muted">
                                  {payout.transactionId || (payout.paymentDate ? formatDate(payout.paymentDate) : '-')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PayoutRequest