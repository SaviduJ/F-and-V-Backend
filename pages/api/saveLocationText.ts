import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware'; // Ensure you have this utility for CORS

const prisma = new PrismaClient();

const cors = initMiddleware(
  Cors({
    origin: 'http://localhost:8081', // Allow requests from React Native app's origin
    methods: ['POST', 'OPTIONS'], // Allow POST and OPTIONS requests
  })
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);

  // Explicitly add CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8081');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'POST') {
    const { locationId, userId, savedText } = req.body;

    // Validate the request body
    if (typeof locationId !== 'number' || typeof savedText !== 'string' || typeof userId !== 'number') {
      console.log('Invalid request data:', { locationId, userId, savedText });
      return res.status(400).json({ error: 'Invalid request body' });
    }

    try {
      // Insert or update saved text in the database
      const result = await prisma.savedTexts.upsert({
        where: {
          id: (await prisma.savedTexts.findFirst({
            where: { locationId, userId },
            select: { id: true }
          }))?.id ?? -1, // If no matching record, use a non-existent id
        },
        update: { savedText },
        create: {
          locationId,
          userId,
          savedText,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
