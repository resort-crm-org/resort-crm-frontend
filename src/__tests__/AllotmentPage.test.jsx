import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AllotmentPage from '../pages/AllotmentPage';

const defaultProps = {
  guests: [],
  availableRooms: [],
  selectedGuestId: '',
  setSelectedGuestId: vi.fn(),
  selectedRoomId: '',
  setSelectedRoomId: vi.fn(),
  days: '',
  setDays: vi.fn(),
  onAllot: vi.fn(),
  disabled: false,
  loading: false,
};

describe('AllotmentPage', () => {
  it('renders the Room Allotment heading', () => {
    render(<AllotmentPage {...defaultProps} />);
    expect(screen.getByRole('heading', { name: /Room Allotment/i })).toBeInTheDocument();
  });

  it('renders the guest select with default option', () => {
    render(<AllotmentPage {...defaultProps} />);
    expect(screen.getByText('Select guest')).toBeInTheDocument();
  });

  it('renders guests in the guest select', () => {
    const guests = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    render(<AllotmentPage {...defaultProps} guests={guests} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders the RoomSpinner with default option', () => {
    render(<AllotmentPage {...defaultProps} />);
    expect(screen.getByText('Select available room')).toBeInTheDocument();
  });

  it('renders days input', () => {
    render(<AllotmentPage {...defaultProps} />);
    expect(screen.getByPlaceholderText('Days')).toBeInTheDocument();
  });

  it('renders Allot Room button', () => {
    render(<AllotmentPage {...defaultProps} />);
    expect(screen.getByRole('button', { name: /Allot Room/i })).toBeInTheDocument();
  });

  it('calls onAllot when Allot Room button is clicked', () => {
    const onAllot = vi.fn();
    render(<AllotmentPage {...defaultProps} onAllot={onAllot} />);
    fireEvent.click(screen.getByRole('button', { name: /Allot Room/i }));
    expect(onAllot).toHaveBeenCalled();
  });

  it('disables Allot Room button when disabled is true', () => {
    render(<AllotmentPage {...defaultProps} disabled={true} />);
    expect(screen.getByRole('button', { name: /Allot Room/i })).toBeDisabled();
  });

  it('disables Allot Room button when loading', () => {
    render(<AllotmentPage {...defaultProps} loading={true} />);
    expect(screen.getByRole('button', { name: /Allot Room/i })).toBeDisabled();
  });

  it('shows "No available rooms" message when disabled', () => {
    render(<AllotmentPage {...defaultProps} disabled={true} />);
    expect(screen.getByText(/No available rooms right now/i)).toBeInTheDocument();
  });

  it('does not show "No available rooms" when not disabled', () => {
    render(<AllotmentPage {...defaultProps} disabled={false} />);
    expect(screen.queryByText(/No available rooms right now/i)).not.toBeInTheDocument();
  });

  it('calls setSelectedGuestId when guest select changes', () => {
    const setSelectedGuestId = vi.fn();
    const guests = [{ id: 1, name: 'Alice' }];
    render(<AllotmentPage {...defaultProps} guests={guests} setSelectedGuestId={setSelectedGuestId} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: '1' } });
    expect(setSelectedGuestId).toHaveBeenCalledWith('1');
  });

  it('calls setDays when days input changes', () => {
    const setDays = vi.fn();
    render(<AllotmentPage {...defaultProps} setDays={setDays} />);
    fireEvent.change(screen.getByPlaceholderText('Days'), { target: { value: '5' } });
    expect(setDays).toHaveBeenCalledWith('5');
  });

  it('calls setSelectedRoomId via RoomSpinner onChange', () => {
    const setSelectedRoomId = vi.fn();
    const availableRooms = [{ id: 3, roomNumber: '303' }];
    render(<AllotmentPage {...defaultProps} availableRooms={availableRooms} setSelectedRoomId={setSelectedRoomId} />);
    const selects = screen.getAllByRole('combobox');
    // Second combobox is the RoomSpinner
    fireEvent.change(selects[1], { target: { value: '3' } });
    expect(setSelectedRoomId).toHaveBeenCalledWith('3');
  });
});
