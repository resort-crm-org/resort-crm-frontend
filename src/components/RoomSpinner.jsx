import PropTypes from 'prop-types';

function RoomSpinner({ availableRooms, value, onChange, disabled }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      <option value="">Select available room</option>
      {availableRooms.map((room) => (
        <option key={room.id} value={room.id}>
          Room {room.roomNumber}
        </option>
      ))}
    </select>
  );
}

RoomSpinner.propTypes = {
  availableRooms: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default RoomSpinner;
