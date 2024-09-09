import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    const { routesName } = req.body;

    if (!routesName) {
      return res.status(400).json({ error: 'Route name is required' });
    }

    try {
        const newRoute = await prisma.routes.create({
            data: {
              routesName,
              createdAt: new Date(),
              // Default value if status is not provided
              // Omitting the relational fields
            },
          });
          
      res.status(201).json(newRoute);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create route' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
