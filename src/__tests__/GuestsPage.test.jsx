import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GuestsPage from '../pages/GuestsPage';

const defaultProps = {
  guests: [],
  guestForm: { name: '', email: '', phone: '', address: '' },
  setGuestForm: vi.fn(),
  onCreate: vi.fn(),
  onDelete: vi.fn(),
  guestRoomMap: new Map(),
  onRelease: vi.fn(),
  loading: false,
};

describe('GuestsPage', () => {
  it('renders the Guests heading', () => {
    render(<GuestsPage {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Guests' })).toBeInTheDocument();
  });

  it('shows empty message when no guests', () => {
    render(<GuestsPage {...defaultProps} />);
    expect(screen.getByText('No guests yet.')).toBeInTheDocument();
  });

  it('renders all form inputs', () => {
    render(<GuestsPage {...defaultProps} />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Address')).toBeInTheDocument();
  });

  it('renders the Add Guest button', () => {
    render(<GuestsPage {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Add Guest/i })).toBeInTheDocument();
  });

  it('calls onCreate when Add Guest is clicked', () => {
    const onCreate = vi.fn();
    render(<GuestsPage {...defaultProps} onCreate={onCreate} />);
    fireEvent.click(screen.getByRole('button', { name: /Add Guest/i }));
    expect(onCreate).toHaveBeenCalled();
  });

  it('calls setGuestForm when Name input changes', () => {
    const setGuestForm = vi.fn();
    render(<GuestsPage {...defaultProps} setGuestForm={setGuestForm} />);
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Alice' } });
    expect(setGuestForm).toHaveBeenCalledWith({ name: 'Alice', email: '', phone: '', address: '' });
  });

  it('calls setGuestForm when Email input changes', () => {
    const setGuestForm = vi.fn();
    render(<GuestsPage {...defaultProps} setGuestForm={setGuestForm} />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } });
    expect(setGuestForm).toHaveBeenCalledWith({ name: '', email: 'a@b.com', phone: '', address: '' });
  });

  it('calls setGuestForm when Phone input changes', () => {
    const setGuestForm = vi.fn();
    render(<GuestsPage {...defaultProps} setGuestForm={setGuestForm} />);
    fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '9876543210' } });
    expect(setGuestForm).toHaveBeenCalledWith({ name: '', email: '', phone: '9876543210', address: '' });
  });

  it('calls setGuestForm when Address input changes', () => {
    const setGuestForm = vi.fn();
    render(<GuestsPage {...defaultProps} setGuestForm={setGuestForm} />);
    fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '42 Main St' } });
    expect(setGuestForm).toHaveBeenCalledWith({ name: '', email: '', phone: '', address: '42 Main St' });
  });

  it('renders guest list details with phone only (no email or address)', () => {
    const guests = [
      { id: 1, name: 'Alice', email: 'alice@test.com', phone: '555-1234', address: '1 Main St' },
    ];
    render(<GuestsPage {...defaultProps} guests={guests} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/Phone: 555-1234/)).toBeInTheDocument();
    expect(screen.queryByText(/alice@test.com/)).not.toBeInTheDocument();
    expect(screen.queryByText(/1 Main St/)).not.toBeInTheDocument();
  });

  it('renders Delete button for each guest', () => {
    const guests = [
      { id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' },
      { id: 2, name: 'Bob', email: 'b@test.com', phone: '666', address: 'Ave' },
    ];
    render(<GuestsPage {...defaultProps} guests={guests} />);
    expect(screen.getAllByRole('button', { name: /Delete/i })).toHaveLength(2);
  });

  it('calls onDelete with guest id when Delete is clicked', () => {
    const onDelete = vi.fn();
    const guests = [{ id: 42, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }];
    render(<GuestsPage {...defaultProps} guests={guests} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(onDelete).toHaveBeenCalledWith(42);
  });

  it('shows room tag when guest has a room assigned', () => {
    const guests = [{ id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }];
    const guestRoomMap = new Map([[1, { roomNumber: '303', allottedDays: 7 }]]);
    render(<GuestsPage {...defaultProps} guests={guests} guestRoomMap={guestRoomMap} />);
    expect(screen.getByText(/Room 303/)).toBeInTheDocument();
    expect(screen.getByText(/7 days/)).toBeInTheDocument();
  });

  it('shows Release Room button when guest has a room', () => {
    const guests = [{ id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }];
    const guestRoomMap = new Map([[1, { roomNumber: '101', allottedDays: 2 }]]);
    render(<GuestsPage {...defaultProps} guests={guests} guestRoomMap={guestRoomMap} />);
    expect(screen.getByRole('button', { name: /Release Room/i })).toBeInTheDocument();
  });

  it('calls onRelease with guest id when Release Room is clicked', () => {
    const onRelease = vi.fn();
    const guests = [{ id: 5, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }];
    const guestRoomMap = new Map([[5, { roomNumber: '101', allottedDays: 2 }]]);
    render(<GuestsPage {...defaultProps} guests={guests} guestRoomMap={guestRoomMap} onRelease={onRelease} />);
    fireEvent.click(screen.getByRole('button', { name: /Release Room/i }));
    expect(onRelease).toHaveBeenCalledWith(5);
  });

  it('disables Add Guest button when loading', () => {
    render(<GuestsPage {...defaultProps} loading={true} />);
    expect(screen.getByRole('button', { name: /Add Guest/i })).toBeDisabled();
  });

  it('does not show Release Room button when guest has no room', () => {
    const guests = [{ id: 1, name: 'Alice', email: 'a@test.com', phone: '555', address: 'St' }];
    render(<GuestsPage {...defaultProps} guests={guests} />);
    expect(screen.queryByRole('button', { name: /Release Room/i })).not.toBeInTheDocument();
  });
});
