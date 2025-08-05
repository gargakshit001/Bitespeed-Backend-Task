import { Request, Response } from 'express';
import { identifyContact } from '../services/identifyService';
import { IdentifyRequest } from '../types';

export const identify = async (req: Request, res: Response) => {
  const body: IdentifyRequest = req.body;

  try {
    const response = await identifyContact(body);
    res.json(response);
  } catch (error: any) {
    console.error('Error processing request:', error);
    
    if (error.message === 'At least one contact method required') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};