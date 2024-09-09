// pages/api/getDashboardLocation.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import Cors from 'cors';
import initMiddleware from '../../lib/init-middleware';

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
      const locationDetails = await prisma.locationDetails.findMany({
        select: {
          id: true,
          latitude: true,
          longitude: true,
          name: true,
          phoneNumber:true,
          routeId: true,
        },
      });

      res.status(200).json(locationDetails);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
