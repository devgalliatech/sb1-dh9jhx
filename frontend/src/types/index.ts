export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  endDate: string;
  category: string;
  status: 'draft' | 'active' | 'funded' | 'ended';
  creator: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  images: string[];
  stats?: {
    contributorsCount: number;
    commentsCount: number;
  };
  createdAt: string;
  updatedAt: string;
}