import PropTypes from 'prop-types';

function RoomsPage({ rooms, onRelease, loading }) {
  const availableCount = rooms.filter((room) => room.status === 'AVAILABLE').length;
  const bookedCount = rooms.length - availableCount;

  return (
    <section className="card">
      <h2>Rooms</h2>
      <p className="occupancy-summary" aria-live="polite">
        <span className="occupancy-value available">Available: {availableCount}</span>
        {' | '}
        <span className="occupancy-value booked">Booked: {bookedCount}</span>
      </p>
      <div className="list">
        {rooms.length === 0 && <p>No rooms yet.</p>}
        {rooms.map((room) => (
          <div key={room.id} className="list-item">
            <div>
              <strong>Room {room.roomNumber}</strong>
              <div className={`tag ${room.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
                {room.status}
              </div>
              {room.guest && (
                <div className="meta">
                  Guest: {room.guest.name} · {room.allottedDays} days
                </div>
              )}
            </div>
            {room.guest && (
              <div className="actions">
                <button onClick={() => onRelease(room.guest.id)} disabled={loading}>
                  Release
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

RoomsPage.propTypes = {
  rooms: PropTypes.array.isRequired,
  onRelease: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default RoomsPage;
