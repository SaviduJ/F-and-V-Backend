import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'; // Ensure you have this utility for CORS

const prisma = new PrismaClient();

const cors = initMiddleware(
  Cors({
    origin: 'http://localhost:8081', // Allow requests from React Native app's origin
    methods: ['GET', 'OPTIONS'], // Allow GET and OPTIONS requests
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  // Explicitly add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      // Retrieve all saved texts from the database
      const savedTexts = await prisma.savedTexts.findMany({
        select: {
          id: true,
          savedText: true,
          locationId: true,
          userId: true,
        },
      });

      res.status(200).json(savedTexts);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
