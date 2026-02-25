// API client for faz-ticket-frontend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  // Matches endpoints
  matches: {
    getAll: async (status?: string, competition?: string) => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (competition) params.append('competition', competition);
      
      const res = await fetch(`${API_URL}/api/matches?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch matches');
      return res.json();
    },

    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/api/matches/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch match');
      return res.json();
    },

    updateTickets: async (id: string, quantity: number) => {
      const res = await fetch(`${API_URL}/api/matches/${id}/tickets`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('Failed to update tickets');
      return res.json();
    },
  },

  // Ticket endpoints
  tickets: {
    create: async (ticketData: any) => {
      const res = await fetch(`${API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (!res.ok) throw new Error('Failed to create ticket');
      return res.json();
    },

    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/api/tickets/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch ticket');
      return res.json();
    },

    getByMatch: async (matchId: string) => {
      const res = await fetch(`${API_URL}/api/tickets/${matchId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to fetch tickets for match');
      return res.json();
    },

    updateStatus: async (id: string, status: string, paymentId?: string, paymentMethod?: string) => {
      const res = await fetch(`${API_URL}/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentId, paymentMethod }),
      });
      if (!res.ok) throw new Error('Failed to update ticket');
      return res.json();
    },

    cancel: async (id: string) => {
      const res = await fetch(`${API_URL}/api/tickets/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to cancel ticket');
      return res.json();
    },
  },

  // Auth endpoints (if needed later)
  auth: {
    register: async (email: string, password: string, name: string) => {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) throw new Error('Registration failed');
      return res.json();
    },

    login: async (email: string, password: string) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      return res.json();
    },
  },
};
