import PropTypes from 'prop-types';

function GuestsPage({
  guests,
  guestForm,
  setGuestForm,
  onCreate,
  onDelete,
  guestRoomMap,
  onRelease,
  loading,
}) {
  return (
    <section className="card">
      <h2>Guests</h2>
      <div className="form-row">
        <input
          placeholder="Name"
          value={guestForm.name}
          onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={guestForm.email}
          onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={guestForm.phone}
          onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
        />
        <input
          placeholder="Address"
          value={guestForm.address}
          onChange={(e) => setGuestForm({ ...guestForm, address: e.target.value })}
        />
        <button onClick={onCreate} disabled={loading}>
          Add Guest
        </button>
      </div>
      <div className="list">
        {guests.length === 0 && <p>No guests yet.</p>}
        {guests.map((guest) => {
          const room = guestRoomMap.get(guest.id);
          return (
            <div key={guest.id} className="list-item guest-item">
              <div className="guest-content">
                <strong className="guest-name">{guest.name}</strong>
                <div className="meta guest-phone">Phone: {guest.phone}</div>
                <div className="guest-badges">
                  {room ? (
                    <>
                      <span className="tag guest-room-tag">Room {room.roomNumber}</span>
                      <span className="tag guest-days-tag">{room.allottedDays} days</span>
                    </>
                  ) : (
                    <span className="tag guest-room-tag">No room allotted</span>
                  )}
                </div>
              </div>
              <div className="actions">
                {room && (
                  <button onClick={() => onRelease(guest.id)} disabled={loading}>
                    Release Room
                  </button>
                )}
                <button className="danger" onClick={() => onDelete(guest.id)} disabled={loading}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

GuestsPage.propTypes = {
  guests: PropTypes.array.isRequired,
  guestForm: PropTypes.object.isRequired,
  setGuestForm: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  guestRoomMap: PropTypes.instanceOf(Map).isRequired,
  onRelease: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default GuestsPage;
