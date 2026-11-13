import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PricingPilot from './PricingPilot';
import api from '../services/api';
jest.mock('../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn()
  }
}));
const draft = {
  _id: 'draft-1',
  city: 'karachi',
  category: 'economy',
  version: 'pilot-1',
  status: 'draft',
  effectiveFrom: '2026-11-13T00:00:00Z',
  effectiveTo: '2027-11-13T00:00:00Z'
};
beforeEach(() => {
  jest.clearAllMocks();
  api.get.mockImplementation(path => Promise.resolve({
    data: path.endsWith('/cards') ? {
      cards: [draft]
    } : path.endsWith('/history') ? {
      audit: [],
      ledger: []
    } : {
      settled: [],
      drivers: [],
      pending: 0,
      disputed: 0,
      cashFeeReceivablesPaisa: 0
    }
  }));
  api.post.mockResolvedValue({
    data: {}
  });
});
test('saving a draft defaults to 3% fee, 0% driver commission and does not publish', async () => {
  render(<PricingPilot />);
  await screen.findByText(/karachi · economy · pilot-1 · draft/);
  fireEvent.change(screen.getByLabelText('City (explicit service area)'), {
    target: {
      value: 'karachi'
    }
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'Save new draft'
  }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/pricing/v2/admin/cards', expect.objectContaining({
    city: 'karachi',
    policy: expect.objectContaining({
      serviceFeeBps: 300,
      driverCommissionBps: 0,
      negotiatedEnabled: false
    })
  })));
  expect(api.post.mock.calls.some(([path]) => path.endsWith('/publish'))).toBe(false);
  await screen.findByText(/Draft saved/);
});
test('publication requires an explicit action on a saved draft', async () => {
  render(<PricingPilot />);
  fireEvent.click(await screen.findByRole('button', {
    name: 'Publish'
  }));
  await waitFor(() => expect(api.post).toHaveBeenCalledWith('/pricing/v2/admin/cards/draft-1/publish'));
  await screen.findByText(/Published for new quotes only/);
});
test('simulator renders server normal and busy totals', async () => {
  api.post.mockResolvedValue({
    data: {
      normal: {
        breakdown: {
          transportFarePaisa: 49000,
          serviceFeePaisa: 1470,
          passengerTotalPaisa: 50470
        }
      },
      busy: {
        breakdown: {
          transportFarePaisa: 61250,
          serviceFeePaisa: 1838,
          passengerTotalPaisa: 63088
        }
      }
    }
  });
  render(<PricingPilot />);
  await screen.findByText(/karachi · economy/);
  fireEvent.change(screen.getByLabelText('City (explicit service area)'), {
    target: {
      value: 'karachi'
    }
  });
  fireEvent.click(screen.getByRole('tab', {
    name: 'Fare simulator'
  }));
  fireEvent.click(screen.getByRole('button', {
    name: 'Simulate current draft'
  }));
  expect(await screen.findByText(/passenger Total: PKR 504.70/)).toBeInTheDocument();
  expect(screen.getByText(/passenger Total: PKR 630.88/)).toBeInTheDocument();
});
