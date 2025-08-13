import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@ewa/types';
import { users } from './data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | { error: string }>
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  if (req.method === 'GET') {
    // Get user by ID
    const user = users.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.status(200).json(user);
  }
  
  if (req.method === 'PATCH' || req.method === 'PUT') {
    // Update user
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { 
      name, 
      email, 
      phone, 
      role, 
      address, 
      businessInfo, 
      preferences, 
      notes 
    } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required' });
    }
    
    // Check if email already exists in another user
    const existingUser = users.find(user => user.email === email && user.id !== id);
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }
    
    // Update user with all provided data
    const updatedUser: User = {
      ...users[userIndex],
      name,
      email,
      phone,
      role,
      address,
      businessInfo,
      preferences,
      notes,
      updatedAt: new Date().toISOString()
    };
    
    users[userIndex] = updatedUser;
    
    return res.status(200).json(updatedUser);
  }
  
  if (req.method === 'DELETE') {
    // Delete user
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    users.splice(userIndex, 1);
    
    return res.status(204).end();
  }
  
  // Method not allowed
  res.setHeader('Allow', ['GET', 'PATCH', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}