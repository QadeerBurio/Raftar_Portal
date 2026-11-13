import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Chip, CircularProgress, IconButton 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../services/api';

const Payments = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [creditRequests, setCreditRequests] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [imageDialog, setImageDialog] = useState({ open: false, payment: null });
  const [rejectDialog, setRejectDialog] = useState({ open: false, paymentId: '', reason: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [creditRes, allRes] = await Promise.all([
        api.get('/admin/payments?type=wallet_add'),
        api.get('/admin/payments')
      ]);
      
      if (creditRes.data.success) {
        setCreditRequests(creditRes.data.payments);
      }
      if (allRes.data.success) {
        setAllPayments(allRes.data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId) => {
    if (window.confirm('Are you sure you want to approve this credit request?')) {
      try {
        await api.put(`/admin/payments/${paymentId}/approve-credit`);
        fetchData();
      } catch (error) {
        console.error('Approve error:', error);
        alert(error.response?.data?.error || 'Error approving request');
      }
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectDialog.reason) {
      alert('Please provide a rejection reason');
      return;
    }
    try {
      await api.put(`/admin/payments/${rejectDialog.paymentId}/reject-credit`, {
        reason: rejectDialog.reason
      });
      setRejectDialog({ open: false, paymentId: '', reason: '' });
      fetchData();
    } catch (error) {
      console.error('Reject error:', error);
      alert(error.response?.data?.error || 'Error rejecting request');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#FFD700', mb: 3 }}>Payments Management</Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} textColor="inherit">
          <Tab label="All Transactions" sx={{ color: '#FFF' }} />
          <Tab label="Credit Requests" sx={{ color: '#FFF' }} />
          <Tab label="Penalties" sx={{ color: '#FFF' }} />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Box>
          <Typography variant="h6" sx={{ color: '#FFF', mb: 2 }}>All Transactions Overview</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: '#1E1E1E' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#AAA' }}>Date</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>User</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Type</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Payment Method</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Sender Name</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Txn ID</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Status</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Receipt</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} sx={{ color: '#FFF', textAlign: 'center' }}>No payments found</TableCell>
                    </TableRow>
                  ) : (
                    allPayments.map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell sx={{ color: '#FFF' }}>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{payment.userId?.name || 'Unknown'}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{payment.type}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{payment.paymentMethod || 'N/A'}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{payment.metadata?.senderName || '-'}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{payment.transactionId || '-'}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>PKR {payment.amount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color={payment.status === 'completed' ? 'success' : payment.status === 'failed' ? 'error' : 'warning'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {payment.metadata?.screenshotUrl ? (
                            <IconButton 
                              size="small" 
                              sx={{ color: '#FFD700' }}
                              onClick={() => setImageDialog({ open: true, payment: payment })}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          ) : (
                            <Typography variant="caption" sx={{ color: '#555' }}>None</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {payment.status === 'pending' && payment.type === 'wallet_add' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button variant="contained" color="success" size="small" onClick={() => handleApprove(payment._id)}>
                                Approve
                              </Button>
                              <Button variant="contained" color="error" size="small" onClick={() => setRejectDialog({ open: true, paymentId: payment._id, reason: '' })}>
                                Reject
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tabIndex === 1 && (
        <Box>
          <Typography variant="h6" sx={{ color: '#FFF', mb: 2 }}>Manual Bank Transfer Verifications</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: '#1E1E1E' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#AAA' }}>Date</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>User</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Sender Name</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Amount</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Transaction ID</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Receipt</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Status</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {creditRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ color: '#FFF', textAlign: 'center' }}>No requests found</TableCell>
                    </TableRow>
                  ) : (
                    creditRequests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell sx={{ color: '#FFF' }}>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{req.userId?.name || 'Unknown'}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{req.metadata?.senderName}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>PKR {req.amount}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{req.transactionId}</TableCell>
                        <TableCell>
                          {req.metadata?.screenshotUrl ? (
                            <IconButton 
                              size="small" 
                              sx={{ color: '#FFD700' }}
                              onClick={() => setImageDialog({ open: true, payment: req })}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          ) : (
                            <Typography variant="caption" color="error">Missing</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={req.status} 
                            color={req.status === 'completed' ? 'success' : req.status === 'failed' ? 'error' : 'warning'} 
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {req.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button variant="contained" color="success" size="small" onClick={() => handleApprove(req._id)}>
                                Approve
                              </Button>
                              <Button variant="contained" color="error" size="small" onClick={() => setRejectDialog({ open: true, paymentId: req._id, reason: '' })}>
                                Reject
                              </Button>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {tabIndex === 2 && (
        <Box>
          <Typography variant="h6" sx={{ color: '#FFF', mb: 2 }}>Subscription Penalties Ledger</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: '#1E1E1E' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#AAA' }}>Date</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Driver</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Amount Deducted</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Reason</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Subscription ID</TableCell>
                    <TableCell sx={{ color: '#AAA' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allPayments.filter(p => p.type === 'penalty_fee').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ color: '#FFF', textAlign: 'center' }}>No penalties recorded yet</TableCell>
                    </TableRow>
                  ) : (
                    allPayments.filter(p => p.type === 'penalty_fee').map((payment) => (
                      <TableRow key={payment._id}>
                        <TableCell sx={{ color: '#FFF' }}>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>{payment.userId?.name || 'Unknown'}</TableCell>
                        <TableCell sx={{ color: '#FF3B30' }}>PKR {payment.amount}</TableCell>
                        <TableCell sx={{ color: '#FFF' }}>
                          <Chip 
                            label={(payment.metadata?.reason || 'Unknown').replace(/_/g, ' ')} 
                            color="error" 
                            variant="outlined" 
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#AAA', fontSize: '0.85rem' }}>{payment.metadata?.subscriptionId || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status} 
                            color="success" 
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Image Dialog */}
      <Dialog open={imageDialog.open} onClose={() => setImageDialog({ open: false, payment: null })} maxWidth="md" fullWidth>
        <DialogTitle>Transfer Receipt</DialogTitle>
        <DialogContent>
          {imageDialog.payment && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: '#F5F5F5', borderRadius: 1 }}>
              <Typography variant="body1"><strong>Sender:</strong> {imageDialog.payment.metadata?.senderName || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Txn ID:</strong> {imageDialog.payment.transactionId || 'N/A'}</Typography>
              <Typography variant="body1"><strong>Amount:</strong> PKR {imageDialog.payment.amount}</Typography>
            </Box>
          )}
          {imageDialog.payment?.metadata?.screenshotUrl && (
            <img 
              src={process.env.REACT_APP_API_URL?.replace('/api', '') + imageDialog.payment.metadata.screenshotUrl} 
              alt="Receipt" 
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain' }} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Found'; }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialog({ open: false, payment: null })}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, paymentId: '', reason: '' })}>
        <DialogTitle>Reject Credit Request</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>Please provide a reason for rejecting this request (this will be shown to the user).</Typography>
          <TextField
            autoFocus
            fullWidth
            multiline
            rows={3}
            label="Rejection Reason"
            value={rejectDialog.reason}
            onChange={(e) => setRejectDialog({ ...rejectDialog, reason: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, paymentId: '', reason: '' })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleRejectSubmit}>Reject Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;