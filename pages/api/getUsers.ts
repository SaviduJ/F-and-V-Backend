import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch users with their role IDs
    const users = await prisma.users.findMany({
      orderBy: {
        id: 'asc', // Sort routes by id in ascending order
      },
      select: {
        id: true,
        username: true,
        password: true,
        userRoleId: true,
      },
    });

    // Fetch all user roles
    const userRoles = await prisma.userRoles.findMany({
      select: {
        id: true,
        userRole: true,
      },
    });

    // Send both users and userRoles as a JSON response
    res.status(200).json({ users, userRoles });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  } finally {
    await prisma.$disconnect();
  }
}
