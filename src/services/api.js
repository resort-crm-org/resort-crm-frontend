import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL,
});

export const getGuests = () => api.get('/api/guests').then((res) => res.data);
export const createGuest = (payload) => api.post('/api/guests', payload).then((res) => res.data);
export const updateGuest = (id, payload) => api.put(`/api/guests/${id}`, payload).then((res) => res.data);
export const deleteGuest = (id) => api.delete(`/api/guests/${id}`);

export const getRooms = () => api.get('/api/rooms').then((res) => res.data);
export const getAvailableRooms = () => api.get('/api/rooms/available').then((res) => res.data);
export const allotRoom = (payload) => api.post('/api/rooms/allot', payload).then((res) => res.data);
export const releaseRoom = (guestId) => api.post(`/api/rooms/release/${guestId}`).then((res) => res.data);
