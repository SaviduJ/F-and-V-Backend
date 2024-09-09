import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function updateUserRole(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, newRoleId } = req.body;

      // Ensure both userId and newRoleId are provided
      if (!userId || !newRoleId) {
        return res.status(400).json({ error: 'User ID and new role ID are required' });
      }

      // Update the user role in the database
      await prisma.users.update({
        where: { id: userId },
        data: { userRoleId: newRoleId },
      });

      // Send a success response
      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Failed to update user role' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
