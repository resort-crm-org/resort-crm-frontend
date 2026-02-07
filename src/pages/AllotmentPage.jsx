import PropTypes from 'prop-types';
import RoomSpinner from '../components/RoomSpinner';

function AllotmentPage({
  guests,
  availableRooms,
  selectedGuestId,
  setSelectedGuestId,
  selectedRoomId,
  setSelectedRoomId,
  days,
  setDays,
  onAllot,
  disabled,
  loading,
}) {
  return (
    <section className="card">
      <h2>Room Allotment</h2>
      <div className="form-row">
        <select value={selectedGuestId} onChange={(e) => setSelectedGuestId(e.target.value)}>
          <option value="">Select guest</option>
          {guests.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.name}
            </option>
          ))}
        </select>

        <RoomSpinner
          availableRooms={availableRooms}
          value={selectedRoomId}
          onChange={setSelectedRoomId}
          disabled={disabled}
        />

        <input
          type="number"
          min="1"
          placeholder="Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <button onClick={onAllot} disabled={disabled || loading} className="btn-allot">
          Allot Room
        </button>
      </div>
      {disabled && <p className="meta">No available rooms right now.</p>}
    </section>
  );
}

AllotmentPage.propTypes = {
  guests: PropTypes.array.isRequired,
  availableRooms: PropTypes.array.isRequired,
  selectedGuestId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSelectedGuestId: PropTypes.func.isRequired,
  selectedRoomId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setSelectedRoomId: PropTypes.func.isRequired,
  days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setDays: PropTypes.func.isRequired,
  onAllot: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default AllotmentPage;
