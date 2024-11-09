import axios from 'axios';
import { Project } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchFeaturedProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${API_URL}/api/projects?featured=true`);
  return data;
};

export const fetchAllProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${API_URL}/api/projects`);
  return data;
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  const { data } = await axios.get(`${API_URL}/api/projects/${id}`);
  return data;
};

export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const { data } = await axios.post(`${API_URL}/api/projects`, projectData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return data;
};

export const updateProject = async ({ id, ...projectData }: Partial<Project> & { id: string }): Promise<Project> => {
  const { data } = await axios.put(`${API_URL}/api/projects/${id}`, projectData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return data;
};