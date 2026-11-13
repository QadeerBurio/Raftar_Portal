import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import api from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [revenue, users, rides] = await Promise.all([
        api.get('/admin/analytics/revenue'), api.get('/admin/analytics/users'), api.get('/admin/analytics/rides')
      ]);
      setData({ revenue: revenue.data, users: users.data, rides: rides.data });
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load analytics');
    } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return <Box sx={{ p: 3 }}>
    <Typography variant="h4">Analytics</Typography>
      <Typography>Revenue shows net platform fees for versioned pricing. Cash fees may still be receivable; legacy gross fares are excluded.</Typography>
    <Button onClick={load} disabled={loading}>Refresh</Button>
    {loading && <CircularProgress aria-label="Loading analytics" />}
    {error && <Alert severity="error">{error}</Alert>}
    {!loading && !error && data && <>
      <Typography sx={{ my: 2 }}>Revenue: PKR {Number(data.revenue.total || 0).toLocaleString()} · Users: {data.users.total} · Rides: {data.rides.total}</Typography>
      {[
        ['Monthly revenue', data.revenue.revenue || [], row => `${row._id.year}-${String(row._id.month).padStart(2, '0')}`, row => `PKR ${Number(row.total || 0).toLocaleString()}`],
        ['Users by role', data.users.roleDistribution || [], row => row._id, row => row.count],
        ['Rides by status', data.rides.rideStats || [], row => row._id, row => row.count]
      ].map(([title, rows, label, value]) => <Paper key={title} sx={{ my: 2, p: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {rows.length === 0 ? <Typography>No data available</Typography> : <Table size="small">
          <TableHead><TableRow><TableCell>Category</TableCell><TableCell align="right">Total</TableCell></TableRow></TableHead>
          <TableBody>{rows.map((row, index) => <TableRow key={index}><TableCell>{label(row)}</TableCell><TableCell align="right">{value(row)}</TableCell></TableRow>)}</TableBody>
        </Table>}
      </Paper>)}
    </>}
  </Box>;
}
