import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, oldPassword, newPassword, username } = req.body;

      // Ensure the ID and username are provided
      if (!id || !username) {
        return res.status(400).json({ error: 'ID and username are required' });
      }

      // Fetch the user from the database
      const user = await prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if ((oldPassword || newPassword) && (!oldPassword || !newPassword)) {
        return res.status(400).json({ error: 'Both Old Password and New Password are required ' });
      }


      // Check if oldPassword and newPassword are provided
      if (oldPassword && newPassword) {
        // Verify the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ error: 'Old password is incorrect' });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user with new password and username
        await prisma.users.update({
          where: { id },
          data: { username, password: hashedNewPassword },
        });
      } else {
        // Update the username only
        await prisma.users.update({
          where: { id },
          data: { username },
        });
      }

      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
