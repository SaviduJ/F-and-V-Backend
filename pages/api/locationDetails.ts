import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

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
    const { userId, phoneNumber, name, latitude, longitude,routeId, } = req.body;

    if (!userId || !phoneNumber || !name || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const now = new Date();
      // Calculate the UTC+05:30 timestamp
      const offset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds (5.5 hours)
      const createdAt = new Date(now.getTime() + offset);

      // Save data to the locationDetails table
      await prisma.locationDetails.create({
        data: {
          userId: parseInt(userId, 10),
          phoneNumber,
          name,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          createdAt,
          updatedAt: createdAt,
          routeId:parseInt(routeId, 10)
        },
      });

      res.status(201).json({ message: 'Data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST, OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
