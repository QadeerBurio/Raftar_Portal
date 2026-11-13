import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Paper, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import api from '../services/api';
const root = '/pricing/v2/admin';
const defaults = {
  serviceFeeBps: 300,
  driverCommissionBps: 0,
  statutoryTaxesEnabled: false,
  quoteLifetimeSeconds: 120,
  negotiatedEnabled: false,
  offerMinimumBps: 8500,
  offerMaximumBps: 15000,
  offerLifetimeSeconds: 120,
  freeWaitingSeconds: 180,
  arrivalRadiusMeters: 150,
  locationFreshSeconds: 30,
  waitingNoticeSeconds: 30,
  cashPayableLimitPaisa: 500000,
  surge: {
    mode: 'SCHEDULED',
    capBps: 15000,
    freshnessSeconds: 60,
    staleSeconds: 30,
    minimumRequests: 10,
    holdSeconds: 120,
    hysteresis: 0.1,
    schedules: [{
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startMinute: 480,
      endMinute: 600,
      multiplierBps: 11500
    }, {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startMinute: 1020,
      endMinute: 1200,
      multiplierBps: 11500
    }],
    thresholds: [{
      ratio: 1.2,
      multiplierBps: 11000
    }, {
      ratio: 1.8,
      multiplierBps: 12500
    }, {
      ratio: 2.5,
      multiplierBps: 15000
    }]
  }
};
const initial = () => ({
  city: '',
  category: 'economy',
  version: 'pilot-1',
  effectiveFrom: new Date().toISOString(),
  effectiveTo: new Date(Date.now() + 365 * 86400000).toISOString(),
  rates: {
    basePaisa: 9000,
    perKmPaisa: 3500,
    perMinutePaisa: 200,
    minimumPaisa: 18000,
    waitingPerMinutePaisa: 500
  },
  policy: JSON.parse(JSON.stringify(defaults)),
  zone: {
    type: 'Polygon',
    coordinates: [[[66.6, 24.6], [67.6, 24.6], [67.6, 25.6], [66.6, 25.6], [66.6, 24.6]]]
  }
});
const requestKey = () => window.crypto?.randomUUID?.() || 'admin-' + Date.now() + '-' + Math.random().toString(36).slice(2);
const cash = n => `PKR ${(Number(n || 0) / 100).toFixed(2)}`;
function Breakdown({
  value
}) {
  return <Paper sx={{
    p: 2,
    my: 1
  }}>{Object.entries(value || {}).filter(([k]) => k.endsWith('Paisa')).map(([k, v]) => <Typography key={k}>{k.replace('Paisa', '').replace(/([A-Z])/g, ' $1')}: {cash(v)}</Typography>)}</Paper>;
}
export default function PricingPilot() {
  const [tab, setTab] = useState(0),
    [cards, setCards] = useState([]),
    [history, setHistory] = useState(null),
    [revenue, setRevenue] = useState(null),
    [form, setForm] = useState(initial),
    [advanced, setAdvanced] = useState(JSON.stringify({
      surge: defaults.surge,
      zone: initial().zone
    }, null, 2)),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [busy, setBusy] = useState(false),
    [simulation, setSimulation] = useState(null),
    [distance, setDistance] = useState('10'),
    [duration, setDuration] = useState('25'),
    [multiplier, setMultiplier] = useState('1.25');
  const [finance, setFinance] = useState({
    rideId: '',
    amount: '',
    reason: '',
    refundKey: 'refund-' + requestKey(),
    refundId: ''
  });
  const load = async () => {
    const [c, h, r] = await Promise.all([api.get(root + '/cards'), api.get(root + '/history'), api.get(root + '/revenue')]);
    setCards(c.data.cards);
    setHistory(h.data);
    setRevenue(r.data);
  };
  useEffect(() => {
    load().catch(e => setError(e.response?.data?.error || e.message));
  }, []);
  const act = async (work, message) => {
    if (busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await work();
      await load();
      setNotice(message);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setBusy(false);
    }
  };
  const payload = () => {
    const a = JSON.parse(advanced);
    return {
      ...form,
      policy: {
        ...form.policy,
        surge: a.surge
      },
      zone: a.zone
    };
  };
  const numeric = (name, label, group = 'policy', factor = 1) => <TextField key={name} label={label} type="number" value={form[group][name] / factor} onChange={e => setForm({
    ...form,
    [group]: {
      ...form[group],
      [name]: Math.round(Number(e.target.value) * factor)
    }
  })} size="small" />;
  const template = card => {
    const value = {
      ...card,
      version: card.version + '-next'
    };
    delete value._id;
    setForm(value);
    setAdvanced(JSON.stringify({
      surge: value.policy.surge,
      zone: value.zone
    }, null, 2));
    setTab(0);
  };
  const reconcile = driver => {
    const value = window.prompt('Amount received in PKR');
    if (!value) return;
    const reference = window.prompt('Verified bank receipt reference');
    if (!reference) return;
    const amountPaisa = Math.round(Number(value) * 100);
    const key = requestKey();
    act(() => api.post(`${root}/drivers/${driver._id}/reconcile`, {
      amountPaisa,
      reference
    }, {
      headers: {
        'Idempotency-Key': key
      }
    }), 'Reconciliation recorded');
  };
  return <Box sx={{
    p: 2
  }}><Typography variant="h4">Ride pricing</Typography><Typography sx={{
      my: 1
    }}>Raftar pilot prices · PKR · Asia/Karachi schedules · Passenger service fee and driver commission are separate. Drafts do not affect bookings.</Typography>
    {error && <Alert severity="error">{error}</Alert>}{notice && <Alert severity="success">{notice}</Alert>}{busy && <CircularProgress />}
    <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable"><Tab label="Draft & publish" /><Tab label="Fare simulator" /><Tab label="History & audit" /><Tab label="Revenue & reconciliation" /></Tabs>
    {tab === 0 && <><Paper sx={{
        p: 2,
        my: 2
      }}><Stack spacing={2}>
      <Stack direction="row" spacing={2}><TextField label="City (explicit service area)" value={form.city} onChange={e => setForm({
              ...form,
              city: e.target.value
            })} /><TextField select label="Category" value={form.category} onChange={e => setForm({
              ...form,
              category: e.target.value
            })}>{['bike', 'rickshaw', 'economy', 'comfort'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}</TextField><TextField label="Version" value={form.version} onChange={e => setForm({
              ...form,
              version: e.target.value
            })} /></Stack>
      <TextField label="Effective from (ISO timestamp with timezone)" value={form.effectiveFrom} onChange={e => setForm({
            ...form,
            effectiveFrom: e.target.value
          })} /><TextField label="Effective until (exclusive, ISO timestamp)" value={form.effectiveTo} onChange={e => setForm({
            ...form,
            effectiveTo: e.target.value
          })} />
      <Stack direction="row" spacing={1} useFlexGap sx={{
            flexWrap: 'wrap'
          }}>{[['basePaisa', 'Base PKR'], ['perKmPaisa', 'Per km PKR'], ['perMinutePaisa', 'Per estimated minute PKR'], ['minimumPaisa', 'Minimum PKR'], ['waitingPerMinutePaisa', 'Waiting/minute PKR']].map(([n, l]) => numeric(n, l, 'rates', 100))}</Stack>
      <Stack direction="row" spacing={1}>{numeric('serviceFeeBps', 'Passenger service fee %', 'policy', 100)}{numeric('driverCommissionBps', 'Separate driver commission %', 'policy', 100)}<TextField select label="Negotiated mode" value={String(form.policy.negotiatedEnabled)} onChange={e => setForm({
              ...form,
              policy: {
                ...form.policy,
                negotiatedEnabled: e.target.value === 'true'
              }
            })}><MenuItem value="false">Disabled (upfront only)</MenuItem><MenuItem value="true">Enabled</MenuItem></TextField></Stack>
      <Stack direction="row" spacing={1} useFlexGap sx={{
            flexWrap: 'wrap'
          }}>{[['quoteLifetimeSeconds', 'Quote expiry seconds'], ['offerLifetimeSeconds', 'Offer expiry seconds'], ['freeWaitingSeconds', 'Free pickup waiting seconds'], ['waitingNoticeSeconds', 'Warning before free expiry seconds'], ['arrivalRadiusMeters', 'Arrival radius metres'], ['locationFreshSeconds', 'GPS freshness seconds'], ['offerMinimumBps', 'Minimum recommended offer %', 100], ['offerMaximumBps', 'Maximum recommended offer %', 100], ['cashPayableLimitPaisa', 'Driver cash payable limit PKR', 100]].map(([n, l, f]) => numeric(n, l, 'policy', f || 1))}</Stack>
      <Typography>Surge and zone policy: choose exactly OFF, SCHEDULED or LIVE_DEMAND. Multipliers use basis points (11500 = 1.15×); schedule minutes are Asia/Karachi minutes after midnight. Temporary overrides require multiplierBps, reason and expiresAt (within 24 hours). Edit thresholds, freshness, hold time, hysteresis and the service polygon below.</Typography>
      <TextField label="Advanced surge and service-zone configuration" multiline minRows={12} value={advanced} onChange={e => setAdvanced(e.target.value)} />
      <Button disabled={busy} variant="contained" onClick={() => act(() => api.post(root + '/cards', payload()), 'Draft saved. Review and explicitly publish below.')}>Save new draft</Button>
    </Stack></Paper>{cards.map(c => <Paper key={c._id} sx={{
        p: 2,
        my: 1
      }}><Typography>{c.city} · {c.category} · {c.version} · {c.status}</Typography><Typography>{new Date(c.effectiveFrom).toISOString()} to {new Date(c.effectiveTo).toISOString()}</Typography><Button onClick={() => template(c)}>Clone to new version</Button>{c.status === 'draft' && <Button disabled={busy} onClick={() => act(() => api.post(`${root}/cards/${c._id}/publish`), 'Published for new quotes only')}>Publish</Button>}{c.status === 'published' && <Button disabled={busy} onClick={() => {
          const reason = window.prompt('Reason to retire this rate card now');
          if (reason) act(() => api.post(`${root}/cards/${c._id}/retire`, {
            reason
          }), 'Retired. Existing accepted rides retain their pricing.');
        }}>Retire now</Button>}</Paper>)}</>}
    {tab === 1 && <Stack spacing={2} sx={{
      my: 2
    }}><Typography>Preview only. Bookings always use a server-verified road route.</Typography><TextField label="Distance km" value={distance} onChange={e => setDistance(e.target.value)} /><TextField label="Estimated journey minutes" value={duration} onChange={e => setDuration(e.target.value)} /><TextField label="Busy multiplier (maximum 1.50)" value={multiplier} onChange={e => setMultiplier(e.target.value)} /><Button disabled={busy} onClick={() => act(async () => {
        const r = await api.post(root + '/simulate', {
          card: payload(),
          distanceMeters: Math.round(Number(distance) * 1000),
          durationSeconds: Math.round(Number(duration) * 60),
          multiplierBps: Math.round(Number(multiplier) * 10000)
        });
        setSimulation(r.data);
      }, 'Simulation ready')}>Simulate current draft</Button>{simulation && <><Typography>Normal</Typography><Breakdown value={simulation.normal.breakdown} /><Typography>Busy</Typography><Breakdown value={simulation.busy.breakdown} /></>}</Stack>}
    {tab === 2 && <><Typography variant="h6" sx={{
        my: 2
      }}>Immutable pricing audit</Typography>{history?.audit?.map(a => <Paper key={a._id} sx={{
        p: 1,
        my: 1
      }}><Typography>{new Date(a.at).toLocaleString()} · {a.action} · {a.entity} · actor {a.actor || 'migration'}</Typography><details><summary>Snapshot</summary><pre style={{
            whiteSpace: 'pre-wrap'
          }}>{JSON.stringify(a.data, null, 2)}</pre></details></Paper>)}<Typography variant="h6">Financial ledger</Typography>{history?.ledger?.map(l => <Typography key={l._id}>{new Date(l.createdAt).toLocaleString()} · {l.kind} · ride {l.rideId || '—'} · {l.key}</Typography>)}</>}
    {tab === 3 && <><Paper sx={{
        p: 2,
        my: 2
      }}><Typography variant="h6">Refunds and cash disputes</Typography><Stack spacing={1}>
      <TextField label="Ride ID" value={finance.rideId} onChange={e => setFinance({
            ...finance,
            rideId: e.target.value
          })} />
      <TextField label="Refund amount PKR" value={finance.amount} onChange={e => setFinance({
            ...finance,
            amount: e.target.value
          })} />
      <TextField label="Reason / resolution evidence" value={finance.reason} onChange={e => setFinance({
            ...finance,
            reason: e.target.value
          })} />
      <TextField label="Request key (reuse on offline retry)" value={finance.refundKey} onChange={e => setFinance({
            ...finance,
            refundKey: e.target.value
          })} />
      <Button disabled={busy} onClick={() => act(() => api.post(root + '/rides/' + finance.rideId + '/refund', {
            amountPaisa: Math.round(Number(finance.amount) * 100),
            reason: finance.reason
          }, {
            headers: {
              'Idempotency-Key': finance.refundKey
            }
          }), 'Original wallet allocations reversed')}>Refund wallet payment</Button>
      <Button disabled={busy} onClick={() => act(() => api.post(root + '/rides/' + finance.rideId + '/cash-refund', {
            refundKey: finance.refundKey,
            amountPaisa: Math.round(Number(finance.amount) * 100),
            reason: finance.reason
          }), 'Cash refund proposed. No reversal until driver confirms return and passenger acknowledges receipt.')}>Propose cash refund</Button>
      <Button disabled={busy} onClick={() => act(() => api.post(root + '/rides/' + finance.rideId + '/resolve-cash', {
            reason: finance.reason
          }), 'Cash dispute reopened for fresh participant acknowledgements')}>Reopen cash payment dispute</Button>
      <TextField label="Disputed cash refund ID" value={finance.refundId} onChange={e => setFinance({
            ...finance,
            refundId: e.target.value
          })} />
      <Button disabled={busy} onClick={() => act(() => api.post(root + '/cash-refunds/' + finance.refundId + '/resolve', {
            reason: finance.reason
          }), 'Cash refund reopened for fresh acknowledgements')}>Reopen cash refund dispute</Button>
      <Typography>External provider refunds remain unavailable. Cash return is recorded only after both parties acknowledge it. Reconciliation records a verified bank receipt and never debits another wallet.</Typography>
    </Stack></Paper><Typography sx={{
        my: 2
      }}>Outstanding driver cash fee receivables: {cash(revenue?.cashFeeReceivablesPaisa)} · Pending: {revenue?.pending || 0} · Disputed: {revenue?.disputed || 0}</Typography>{revenue?.settled?.map(r => <Paper key={r._id} sx={{
        p: 2,
        my: 1
      }}><Typography variant="h6">{r._id} settlements</Typography><Breakdown value={r} /><Typography>Platform fee less refunded allocations: {cash(r.serviceFeePaisa + r.commissionPaisa - (r.refundedPlatformPaisa || 0))}. Cash fees remain receivables until reconciled.</Typography></Paper>)}{revenue?.drivers?.map(d => <Paper key={d._id} sx={{
        p: 2,
        my: 1
      }}><Typography>{d.userId?.name || d._id} · Wallet earnings {cash(d.earningsBalancePaisa)} · Cash fee payable {cash(d.cashPayablePaisa)}</Typography><Button disabled={busy || !(d.cashPayablePaisa > 0)} onClick={() => reconcile(d)}>Record verified fee receipt</Button></Paper>)}</>}
  </Box>;
}
