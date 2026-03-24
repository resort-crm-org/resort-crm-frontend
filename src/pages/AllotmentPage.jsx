import { useState } from 'react';
import PropTypes from 'prop-types';
import RoomSpinner from '../components/RoomSpinner';

const PRICE_BY_ROOM_TYPE = {
  Standard: 1000,
  Deluxe: 2000,
  Suite: 3500,
};

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
  const [roomType, setRoomType] = useState('');
  const [price, setPrice] = useState(0);
  const parsedDays = Number(days);
  const totalPrice = roomType && Number.isFinite(parsedDays) && parsedDays > 0 ? price * parsedDays : 0;

  const handleRoomTypeChange = (event) => {
    const nextRoomType = event.target.value;
    setRoomType(nextRoomType);
    setPrice(PRICE_BY_ROOM_TYPE[nextRoomType] ?? 0);
  };

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

        <select value={roomType} onChange={handleRoomTypeChange} aria-label="Room type" disabled={loading}>
          <option value="">Select room type</option>
          <option value="Standard">Standard</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Suite">Suite</option>
        </select>

        <input
          type="number"
          value={totalPrice}
          placeholder="Total Price"
          aria-label="Total Price"
          readOnly
          disabled={loading}
        />

        <button onClick={onAllot} disabled={disabled || loading}>
          Allot Room
        </button>
      </div>
      <p className="meta">Price per day: Rs {price} | Total: Rs {totalPrice}</p>
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
