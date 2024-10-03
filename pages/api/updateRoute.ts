import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'; // Ensure you have this utility for CORS

const prisma = new PrismaClient();

const cors = initMiddleware(
  Cors({
    origin: 'http://localhost:8081', // Allow requests from React Native app's origin
    methods: ['POST', 'OPTIONS'], // Allow POST and OPTIONS requests
    allowedHeaders: ['Content-Type'], // Allow Content-Type header
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  // Explicitly add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { id, Good, Rejected,status,routesName } = req.body;

    if (!id) {
      res.status(400).json({ error: 'Route ID is required' });
      return;
    }

    try {
      // Update the route with the given ID
      const updatedRoute = await prisma.routes.update({
        where: { id: Number(id) },
        data: {
          routesName,
          status,
          Good,
          Rejected,
        },
      });

      res.status(200).json(updatedRoute);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
