// API client for game-day-dashboard admin panel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const adminApi = {
  matches: {
    // Get all matches for admin
    getAll: async () => {
      const res = await fetch(`${API_URL}/api/admin/matches`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json();
    },

    // Create a new match
    create: async (matchData: any) => {
      const res = await fetch(`${API_URL}/api/admin/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });
      if (!res.ok) throw new Error('Failed to create match');
      return res.json();
    },

    // Update a match
    update: async (id: string, matchData: any) => {
      const res = await fetch(`${API_URL}/api/admin/matches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });
      if (!res.ok) throw new Error('Failed to update match');
      return res.json();
    },

    // Delete a match
    delete: async (id: string) => {
      const res = await fetch(`${API_URL}/api/admin/matches/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to delete match');
      return res.json();
    },
  },
};
