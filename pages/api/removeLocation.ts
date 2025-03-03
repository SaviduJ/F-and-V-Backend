import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

const prisma = new PrismaClient();

const cors = initMiddleware(
  Cors({
    origin: 'http://localhost:8081', // Allow requests from your React Native app
    methods: ['DELETE', 'OPTIONS'], // Allow DELETE and OPTIONS requests
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  // Explicitly add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      // Remove the location from the database
      await prisma.locationDetails.delete({
        where: { id: parseInt(id, 10) },
      });

      res.status(200).json({ message: 'Location removed successfully' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['DELETE', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
