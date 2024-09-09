import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch only the id, username, and password fields from the users table
    const users = await prisma.userRoles.findMany({
      select: {
        id: true,
        userRole: true,
      },
    });
    
    // Send the fetched data as a JSON response
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect();
  }
}
