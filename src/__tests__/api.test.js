import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockInstance),
    },
  };
});

import axios from 'axios';
import {
  api,
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest,
  getRooms,
  getAvailableRooms,
  allotRoom,
  releaseRoom,
} from '../services/api';

describe('api service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('getGuests calls GET /api/guests and returns data', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, name: 'Alice' }] });
    const result = await getGuests();
    expect(api.get).toHaveBeenCalledWith('/api/guests');
    expect(result).toEqual([{ id: 1, name: 'Alice' }]);
  });

  it('createGuest calls POST /api/guests with payload', async () => {
    api.post.mockResolvedValue({ data: { id: 1 } });
    const payload = { name: 'Alice', email: 'a@b.com', phone: '123', address: 'St' };
    const result = await createGuest(payload);
    expect(api.post).toHaveBeenCalledWith('/api/guests', payload);
    expect(result).toEqual({ id: 1 });
  });

  it('updateGuest calls PUT /api/guests/:id with payload', async () => {
    api.put.mockResolvedValue({ data: { id: 1, name: 'Updated' } });
    const result = await updateGuest(1, { name: 'Updated' });
    expect(api.put).toHaveBeenCalledWith('/api/guests/1', { name: 'Updated' });
    expect(result).toEqual({ id: 1, name: 'Updated' });
  });

  it('deleteGuest calls DELETE /api/guests/:id', async () => {
    api.delete.mockResolvedValue({});
    await deleteGuest(7);
    expect(api.delete).toHaveBeenCalledWith('/api/guests/7');
  });

  it('getRooms calls GET /api/rooms and returns data', async () => {
    api.get.mockResolvedValue({ data: [{ id: 1, roomNumber: '101' }] });
    const result = await getRooms();
    expect(api.get).toHaveBeenCalledWith('/api/rooms');
    expect(result).toEqual([{ id: 1, roomNumber: '101' }]);
  });

  it('getAvailableRooms calls GET /api/rooms/available and returns data', async () => {
    api.get.mockResolvedValue({ data: [{ id: 2, roomNumber: '202' }] });
    const result = await getAvailableRooms();
    expect(api.get).toHaveBeenCalledWith('/api/rooms/available');
    expect(result).toEqual([{ id: 2, roomNumber: '202' }]);
  });

  it('allotRoom calls POST /api/rooms/allot with payload', async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    const payload = { guestId: 1, roomId: 2, days: 3 };
    const result = await allotRoom(payload);
    expect(api.post).toHaveBeenCalledWith('/api/rooms/allot', payload);
    expect(result).toEqual({ success: true });
  });

  it('releaseRoom calls POST /api/rooms/release/:guestId', async () => {
    api.post.mockResolvedValue({ data: { released: true } });
    const result = await releaseRoom(5);
    expect(api.post).toHaveBeenCalledWith('/api/rooms/release/5');
    expect(result).toEqual({ released: true });
  });

  it('getGuests propagates rejection on error', async () => {
    api.get.mockRejectedValue(new Error('Network error'));
    await expect(getGuests()).rejects.toThrow('Network error');
  });

  it('createGuest propagates rejection on error', async () => {
    api.post.mockRejectedValue(new Error('Server error'));
    await expect(createGuest({})).rejects.toThrow('Server error');
  });

  it('throws when VITE_BACKEND_URL is not set', async () => {
    vi.resetModules();
    vi.stubEnv('VITE_BACKEND_URL', '');

    await expect(import('../services/api')).rejects.toThrow(
      'VITE_BACKEND_URL is not set in the environment'
    );
  });
});
