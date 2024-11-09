import axios from 'axios';
import { Project } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDashboardProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${API_URL}/api/dashboard/projects`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return data;
};

export const fetchProjectStats = async (projectId: string) => {
  const { data } = await axios.get(
    `${API_URL}/api/dashboard/projects/${projectId}/stats`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
  return data;
};