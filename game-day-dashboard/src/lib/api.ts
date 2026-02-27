// API client for game-day-dashboard admin panel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const adminApi = {
  matches: {
    // Get all matches for admin
    getAll: async () => {
      const res = await fetch(`${API_URL}/api/matches/admin/matches`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Fetch failed:', errText);
        throw new Error(`Failed to fetch matches: ${errText}`);
      }
      return res.json();
    },

    // Create a new match
    create: async (matchData: any) => {
      const res = await fetch(`${API_URL}/api/matches/admin/matches`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(matchData),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Create failed:', errText);
        throw new Error(`Failed to create match: ${res.status} ${errText}`);
      }
      try {
        const data = await res.json();
        return data;
      } catch (e) {
        const text = await res.text();
        console.error('JSON parse error:', text);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    },

    // Fetch match details by ID (admin)
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/api/matches/admin/matches/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch match');
      return res.json();
    },

    // Update a match
    update: async (id: string, matchData: any) => {
      const res = await fetch(`${API_URL}/api/matches/admin/matches/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(matchData),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Update failed:', errText);
        throw new Error(`Failed to update match: ${res.status} ${errText}`);
      }
      try {
        const data = await res.json();
        return data;
      } catch (e) {
        const text = await res.text();
        console.error('JSON parse error:', text);
        throw new Error(`Invalid JSON response: ${text}`);
      }
    },

    // Delete a match
    delete: async (id: string) => {
      const res = await fetch(`${API_URL}/api/matches/admin/matches/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Delete failed:', errText);
        throw new Error(`Failed to delete match: ${res.status}`);
      }
      return res.json();
    },
  },
};
