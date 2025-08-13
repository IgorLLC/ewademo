import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@ewa/types';

// Import shared user data
import { users } from './users/data';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[] | User | { error: string }>
) {
  if (req.method === 'GET') {
    // Return all users
    return res.status(200).json(users);
  }
  
  if (req.method === 'POST') {
    // Create a new user
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
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }
    
    // Create new user with all provided data
    const newUser: User = {
      id: `u${Date.now()}`, // Simple ID generation
      name,
      email,
      phone,
      role,
      address,
      businessInfo,
      preferences,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    users.push(newUser);
    
    return res.status(201).json(newUser);
  }
  
  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}