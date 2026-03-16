import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api', () => ({
  getGuests: vi.fn(),
  getRooms: vi.fn(),
  getAvailableRooms: vi.fn(),
  createGuest: vi.fn(),
  deleteGuest: vi.fn(),
  allotRoom: vi.fn(),
  releaseRoom: vi.fn(),
}));

import App from '../App';
import * as api from '../services/api';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getGuests.mockResolvedValue([]);
    api.getRooms.mockResolvedValue([]);
    api.getAvailableRooms.mockResolvedValue([]);
  });

  it('renders the Resort CRM heading', async () => {
    render(<App />);
    expect(screen.getByText('Resort CRM')).toBeInTheDocument();
  });

  it('renders all three page sections', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Guests' })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /Room Allotment/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Rooms' })).toBeInTheDocument();
    });
  });

  it('fetches data from all endpoints on mount', async () => {
    render(<App />);
    await waitFor(() => {
      expect(api.getGuests).toHaveBeenCalled();
      expect(api.getRooms).toHaveBeenCalled();
      expect(api.getAvailableRooms).toHaveBeenCalled();
    });
  });

  it('shows validation error when Add Guest clicked with empty form', async () => {
    render(<App />);
    await waitFor(() => screen.getByRole('button', { name: /Add Guest/i }));
    fireEvent.click(screen.getByRole('button', { name: /Add Guest/i }));
    await waitFor(() => {
      expect(screen.getByText(/All guest fields are required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error when Allot Room clicked with empty fields', async () => {
    api.getAvailableRooms.mockResolvedValue([{ id: 1, roomNumber: '101' }]);
    render(<App />);
    // Wait until the button is enabled (available rooms loaded)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Allot Room/i })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole('button', { name: /Allot Room/i }));
    await waitFor(() => {
      expect(screen.getByText(/Select guest, room, and days/i)).toBeInTheDocument();
    });
  });

  it('creates a guest and shows success info', async () => {
    api.createGuest.mockResolvedValue({ id: 1, name: 'Alice' });
    render(<App />);
    await waitFor(() => screen.getByPlaceholderText('Name'));

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: 'Main St' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Guest/i }));

    await waitFor(() => {
      expect(api.createGuest).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@test.com',
        phone: '9876543210',
        address: 'Main St',
      });
      expect(screen.getByText(/Guest created/i)).toBeInTheDocument();
    });
  });

  it('shows API error message when createGuest fails', async () => {
    api.createGuest.mockRejectedValue({ response: { data: { message: 'Email already exists' } } });
    render(<App />);
    await waitFor(() => screen.getByPlaceholderText('Name'));

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: 'Main St' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Guest/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error when createGuest fails without message', async () => {
    api.createGuest.mockRejectedValue(new Error('Unknown'));
    render(<App />);
    await waitFor(() => screen.getByPlaceholderText('Name'));

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'alice@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9876543210' } });
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: 'Main St' } });
    fireEvent.click(screen.getByRole('button', { name: /Add Guest/i }));

    await waitFor(() => {
      expect(screen.getByText(/Could not create guest/i)).toBeInTheDocument();
    });
  });

  it('deletes a guest and shows success info', async () => {
    api.getGuests.mockResolvedValue([
      { id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' },
    ]);
    api.deleteGuest.mockResolvedValue({});
    render(<App />);

    await waitFor(() => screen.getByRole('button', { name: /Delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(api.deleteGuest).toHaveBeenCalledWith(1);
      expect(screen.getByText(/Guest deleted/i)).toBeInTheDocument();
    });
  });

  it('shows error when deleteGuest fails', async () => {
    api.getGuests.mockResolvedValue([
      { id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' },
    ]);
    api.deleteGuest.mockRejectedValue({ response: { data: { message: 'Cannot delete' } } });
    render(<App />);

    await waitFor(() => screen.getByRole('button', { name: /Delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/Cannot delete/i)).toBeInTheDocument();
    });
  });

  it('releases a room from RoomsPage and shows success info', async () => {
    api.getRooms.mockResolvedValue([
      { id: 1, roomNumber: '101', status: 'OCCUPIED', guest: { id: 10, name: 'Bob' }, allottedDays: 2 },
    ]);
    api.releaseRoom.mockResolvedValue({});
    render(<App />);

    await waitFor(() => screen.getByText('Room 101'));
    fireEvent.click(screen.getByRole('button', { name: /Release/i }));

    await waitFor(() => {
      expect(api.releaseRoom).toHaveBeenCalledWith(10);
      expect(screen.getByText(/Room released/i)).toBeInTheDocument();
    });
  });

  it('shows error when releaseRoom fails', async () => {
    api.getRooms.mockResolvedValue([
      { id: 1, roomNumber: '101', status: 'OCCUPIED', guest: { id: 10, name: 'Bob' }, allottedDays: 2 },
    ]);
    api.releaseRoom.mockRejectedValue({ response: { data: { message: 'Already released' } } });
    render(<App />);

    await waitFor(() => screen.getByText('Room 101'));
    fireEvent.click(screen.getByRole('button', { name: /Release/i }));

    await waitFor(() => {
      expect(screen.getByText(/Already released/i)).toBeInTheDocument();
    });
  });

  it('allots a room successfully and shows success info', async () => {
    api.getGuests.mockResolvedValue([{ id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }]);
    api.getAvailableRooms.mockResolvedValue([{ id: 2, roomNumber: '101' }]);
    api.allotRoom.mockResolvedValue({ success: true });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Allot Room/i })).not.toBeDisabled();
    });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Days'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Allot Room/i }));

    await waitFor(() => {
      expect(api.allotRoom).toHaveBeenCalledWith({ guestId: 1, roomId: 2, days: 3 });
      expect(screen.getByText(/Room allotted/i)).toBeInTheDocument();
    });
  });

  it('shows API error when allotRoom fails', async () => {
    api.getGuests.mockResolvedValue([{ id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }]);
    api.getAvailableRooms.mockResolvedValue([{ id: 2, roomNumber: '101' }]);
    api.allotRoom.mockRejectedValue({ response: { data: { message: 'Room not available' } } });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Allot Room/i })).not.toBeDisabled();
    });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Days'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Allot Room/i }));

    await waitFor(() => {
      expect(screen.getByText(/Room not available/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error when allotRoom fails without message', async () => {
    api.getGuests.mockResolvedValue([{ id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }]);
    api.getAvailableRooms.mockResolvedValue([{ id: 2, roomNumber: '101' }]);
    api.allotRoom.mockRejectedValue(new Error('unknown'));
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Allot Room/i })).not.toBeDisabled();
    });

    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '1' } });
    fireEvent.change(selects[1], { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('Days'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: /Allot Room/i }));

    await waitFor(() => {
      expect(screen.getByText(/Could not allot room/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error when deleteGuest fails without message', async () => {
    api.getGuests.mockResolvedValue([
      { id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' },
    ]);
    api.deleteGuest.mockRejectedValue(new Error('Unknown'));
    render(<App />);

    await waitFor(() => screen.getByRole('button', { name: /Delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/Could not delete guest/i)).toBeInTheDocument();
    });
  });

  it('shows fallback error when releaseRoom fails without message', async () => {
    api.getRooms.mockResolvedValue([
      { id: 1, roomNumber: '101', status: 'OCCUPIED', guest: { id: 10, name: 'Bob' }, allottedDays: 2 },
    ]);
    api.releaseRoom.mockRejectedValue(new Error('Unknown'));
    render(<App />);

    await waitFor(() => screen.getByRole('button', { name: /Release/i }));
    fireEvent.click(screen.getByRole('button', { name: /Release/i }));

    await waitFor(() => {
      expect(screen.getByText(/Could not release room/i)).toBeInTheDocument();
    });
  });

  it('logs error when initial data load fails', async () => {
    api.getGuests.mockRejectedValue(new Error('Network error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<App />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
