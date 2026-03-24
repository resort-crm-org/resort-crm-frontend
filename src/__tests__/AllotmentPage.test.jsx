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

  it('does not require room type to call onAllot', () => {
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

  it('keeps total price as 0 by default and updates based on room type and days', () => {
    const { rerender } = render(<AllotmentPage {...defaultProps} />);

    expect(screen.getByText('Price per day: Rs 0 | Total: Rs 0')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Room type'), { target: { value: 'Suite' } });
    expect(screen.getByText('Price per day: Rs 3500 | Total: Rs 0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();

    rerender(<AllotmentPage {...defaultProps} days={'3'} />);
    expect(screen.getByDisplayValue('10500')).toBeInTheDocument();
    expect(screen.getByText('Price per day: Rs 3500 | Total: Rs 10500')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Room type'), { target: { value: '' } });
    expect(screen.getByDisplayValue('0')).toBeInTheDocument();
  });

  it('renders total price field as read-only', () => {
    render(<AllotmentPage {...defaultProps} />);

    expect(screen.getByLabelText('Total Price')).toHaveAttribute('readonly');
  });

  it('renders room type price cards', () => {
    render(<AllotmentPage {...defaultProps} />);

    const rateList = screen.getByLabelText('Room type prices');

    expect(rateList).toHaveTextContent('Standard');
    expect(rateList).toHaveTextContent('Deluxe');
    expect(rateList).toHaveTextContent('Suite');
    expect(rateList).toHaveTextContent('Rs 1000/day');
    expect(rateList).toHaveTextContent('Rs 2000/day');
    expect(rateList).toHaveTextContent('Rs 3500/day');
  });
});
