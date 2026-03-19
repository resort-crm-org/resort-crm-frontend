import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoomsPage from '../pages/RoomsPage';

const defaultProps = {
  rooms: [],
  onRelease: vi.fn(),
  loading: false,
};

describe('RoomsPage', () => {
  it('renders the Rooms heading', () => {
    render(<RoomsPage {...defaultProps} />);
    expect(screen.getByRole('heading', { name: 'Rooms' })).toBeInTheDocument();
  });

  it('shows empty message when no rooms', () => {
    render(<RoomsPage {...defaultProps} />);
    expect(screen.getByText('No rooms yet.')).toBeInTheDocument();
  });

  it('renders an available room', () => {
    const rooms = [{ id: 1, roomNumber: '101', status: 'AVAILABLE', guest: null }];
    render(<RoomsPage {...defaultProps} rooms={rooms} />);
    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });

  it('renders an occupied room with guest info', () => {
    const rooms = [
      {
        id: 1,
        roomNumber: '202',
        status: 'OCCUPIED',
        guest: { id: 10, name: 'John Doe' },
        allottedDays: 5,
      },
    ];
    render(<RoomsPage {...defaultProps} rooms={rooms} />);
    expect(screen.getByText('Room 202')).toBeInTheDocument();
    expect(screen.getByText('OCCUPIED')).toBeInTheDocument();
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/5 days/)).toBeInTheDocument();
  });

  it('shows Release button for occupied rooms', () => {
    const rooms = [
      { id: 1, roomNumber: '101', status: 'OCCUPIED', guest: { id: 10, name: 'Alice' }, allottedDays: 2 },
    ];
    render(<RoomsPage {...defaultProps} rooms={rooms} />);
    expect(screen.getByRole('button', { name: /Release/i })).toBeInTheDocument();
  });

  it('does not show Release button for available rooms', () => {
    const rooms = [{ id: 1, roomNumber: '101', status: 'AVAILABLE', guest: null }];
    render(<RoomsPage {...defaultProps} rooms={rooms} />);
    expect(screen.queryByRole('button', { name: /Release/i })).not.toBeInTheDocument();
  });

  it('calls onRelease with guest id when Release is clicked', () => {
    const onRelease = vi.fn();
    const rooms = [
      { id: 1, roomNumber: '101', status: 'OCCUPIED', guest: { id: 10, name: 'Alice' }, allottedDays: 3 },
    ];
    render(<RoomsPage {...defaultProps} rooms={rooms} onRelease={onRelease} />);
    fireEvent.click(screen.getByRole('button', { name: /Release/i }));
    expect(onRelease).toHaveBeenCalledWith(10);
  });

  it('disables Release button when loading', () => {
    const rooms = [
      { id: 1, roomNumber: '101', status: 'OCCUPIED', guest: { id: 10, name: 'Alice' }, allottedDays: 3 },
    ];
    render(<RoomsPage {...defaultProps} rooms={rooms} loading={true} />);
    expect(screen.getByRole('button', { name: /Release/i })).toBeDisabled();
  });

  it('renders multiple rooms', () => {
    const rooms = [
      { id: 1, roomNumber: '101', status: 'AVAILABLE', guest: null },
      { id: 2, roomNumber: '102', status: 'AVAILABLE', guest: null },
    ];
    render(<RoomsPage {...defaultProps} rooms={rooms} />);
    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText('Room 102')).toBeInTheDocument();
  });
});
