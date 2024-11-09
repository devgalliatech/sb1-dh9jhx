import { create } from 'zustand';
import axios from 'axios';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  user: null,
  token: localStorage.getItem('token'),

  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });
      localStorage.setItem('token', data.token);
      set({ isAuthenticated: true, token: data.token, user: data.user });
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, userData);
      localStorage.setItem('token', data.token);
      set({ isAuthenticated: true, token: data.token, user: data.user });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: null, user: null });
  }
}));