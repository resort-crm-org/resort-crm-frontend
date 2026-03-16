import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RoomSpinner from '../components/RoomSpinner';

const defaultProps = {
  availableRooms: [],
  value: '',
  onChange: vi.fn(),
  disabled: false,
};

describe('RoomSpinner', () => {
  it('renders the default placeholder option', () => {
    render(<RoomSpinner {...defaultProps} />);
    expect(screen.getByText('Select available room')).toBeInTheDocument();
  });

  it('renders available rooms as options', () => {
    const rooms = [
      { id: 1, roomNumber: '101' },
      { id: 2, roomNumber: '102' },
    ];
    render(<RoomSpinner {...defaultProps} availableRooms={rooms} />);
    expect(screen.getByText('Room 101')).toBeInTheDocument();
    expect(screen.getByText('Room 102')).toBeInTheDocument();
  });

  it('calls onChange with the selected value', () => {
    const onChange = vi.fn();
    const rooms = [{ id: 1, roomNumber: '101' }];
    render(<RoomSpinner {...defaultProps} availableRooms={rooms} onChange={onChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('disables the select when disabled is true', () => {
    render(<RoomSpinner {...defaultProps} disabled={true} />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('is enabled by default', () => {
    render(<RoomSpinner {...defaultProps} />);
    expect(screen.getByRole('combobox')).not.toBeDisabled();
  });

  it('reflects the controlled value', () => {
    const rooms = [{ id: 1, roomNumber: '101' }];
    render(<RoomSpinner {...defaultProps} availableRooms={rooms} value="1" />);
    expect(screen.getByRole('combobox')).toHaveValue('1');
  });

  it('renders with numeric value', () => {
    const rooms = [{ id: 2, roomNumber: '102' }];
    render(<RoomSpinner {...defaultProps} availableRooms={rooms} value={2} />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });
});
