import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function addUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      // Ensure username and password are provided
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      // Check if the username already exists
      const existingUser = await prisma.users.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const newUser = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          userRoleId: 1, // Set default userRoleId, you might adjust this based on your requirements
        },
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error adding user:', error);
      res.status(500).json({ error: 'Failed to add user' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
