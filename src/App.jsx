import { useEffect, useMemo, useState } from 'react';
import {
  allotRoom,
  createGuest,
  deleteGuest,
  getAvailableRooms,
  getGuests,
  getRooms,
  releaseRoom,
} from './services/api';
import GuestsPage from './pages/GuestsPage';
import RoomsPage from './pages/RoomsPage';
import AllotmentPage from './pages/AllotmentPage';

function App() {
  const [theme, setTheme] = useState('dark');
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [selectedGuestId, setSelectedGuestId] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('crm-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
    refreshAll();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('crm-theme', theme);
  }, [theme]);

  const refreshAll = async () => {
    try {
      const [guestData, roomData, availableData] = await Promise.all([
        getGuests(),
        getRooms(),
        getAvailableRooms(),
      ]);
      setGuests(guestData);
      setRooms(roomData);
      setAvailableRooms(availableData);
      setError('');
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleCreateGuest = async () => {
    setError('');
    setInfo('');
    if (!guestForm.name || !guestForm.email || !guestForm.phone || !guestForm.address) {
      setError('All guest fields are required');
      return;
    }
    try {
      setLoading(true);
      await createGuest(guestForm);
      setGuestForm({ name: '', email: '', phone: '', address: '' });
      await refreshAll();
      setInfo('Guest created');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not create guest');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (id) => {
    setError('');
    setInfo('');
    try {
      setLoading(true);
      await deleteGuest(id);
      await refreshAll();
      setInfo('Guest deleted');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not delete guest');
    } finally {
      setLoading(false);
    }
  };

  const handleAllot = async () => {
    setError('');
    setInfo('');
    if (!selectedGuestId || !selectedRoomId || !days) {
      setError('Select guest, room, and days');
      return;
    }
    try {
      setLoading(true);
      await allotRoom({
        guestId: Number(selectedGuestId),
        roomId: Number(selectedRoomId),
        days: Number(days),
      });
      setDays('');
      setSelectedRoomId('');
      await refreshAll();
      setInfo('Room allotted');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not allot room');
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async (guestId) => {
    setError('');
    setInfo('');
    try {
      setLoading(true);
      await releaseRoom(guestId);
      await refreshAll();
      setInfo('Room released');
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not release room');
    } finally {
      setLoading(false);
    }
  };

  const guestRoomMap = useMemo(() => {
    const mapping = new Map();
    rooms.forEach((room) => {
      if (room.guest) {
        mapping.set(room.guest.id, room);
      }
    });
    return mapping;
  }, [rooms]);

  const isAllotDisabled = availableRooms.length === 0 || loading;
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app">
      <header>
        <div className="header-row">
          <div>
            <h1>Resort CRM</h1>
            <p>Manual room allotment with live availability</p>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} type="button">
            {theme === 'dark' ? 'Light theme' : 'Dark theme'}
          </button>
        </div>
      </header>

      {error && <div className="banner error">{error}</div>}
      {info && <div className="banner info">{info}</div>}

      <div className="grid">
        <GuestsPage
          guests={guests}
          guestForm={guestForm}
          setGuestForm={setGuestForm}
          onCreate={handleCreateGuest}
          onDelete={handleDeleteGuest}
          guestRoomMap={guestRoomMap}
          onRelease={handleRelease}
          loading={loading}
        />
        <AllotmentPage
          guests={guests}
          availableRooms={availableRooms}
          selectedGuestId={selectedGuestId}
          setSelectedGuestId={setSelectedGuestId}
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
          days={days}
          setDays={setDays}
          onAllot={handleAllot}
          disabled={isAllotDisabled}
          loading={loading}
        />
        <RoomsPage rooms={rooms} onRelease={handleRelease} loading={loading} />
      </div>
    </div>
  );
}

export default App;
