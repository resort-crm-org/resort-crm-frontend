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
        <button onClick={onCreate} disabled={loading} className="btn-add">
          Add Guest
        </button>
      </div>
      <div className="list">
        {guests.length === 0 && <p>No guests yet.</p>}
        {guests.map((guest) => {
          const room = guestRoomMap.get(guest.id);
          return (
            <div key={guest.id} className="list-item">
              <div>
                <strong>{guest.name}</strong>
                <div className="meta">{guest.email} · {guest.phone}</div>
                <div className="meta">{guest.address}</div>
                {room && <div className="tag">Room {room.roomNumber} · {room.allottedDays} days</div>}
              </div>
              <div className="actions">
                {room && (
                  <button onClick={() => onRelease(guest.id)} disabled={loading} className="btn-release">
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
