import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function assignManager(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { routeId, factoryManagerId } = req.body;

      if (typeof routeId !== 'number' || typeof factoryManagerId !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
      }

      const currentDate = new Date();
      const factoryManagerAssignDate = currentDate.toLocaleString('en-UK', {
        timeZone: 'Asia/Kolkata', // UTC+05:30
        hour12: true,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });

      // Update the route with the new field officer ID
      await prisma.routes.update({
        where: { id: routeId },
        data: { factoryManagerId ,
          factoryManagerAssignDate
        },
      });

      res.status(200).json({ message: 'Field officer assigned successfully' });
    } catch (error) {
      console.error('Error assigning field officer:', error);
      res.status(500).json({ error: 'Failed to assign field officer' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
