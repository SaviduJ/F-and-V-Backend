import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
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

  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
      // Find user by username
      const user = await prisma.users.findUnique({
        where: { username },
        select: { id: true, password: true, userRoleId: true },
      });

      // Check if the user exists and if the password matches
      if (user && await bcrypt.compare(password, user.password)) {
        const token = 'some-auth-token';
        res.status(200).json({ message: 'Login successful', token, userId: user.id, userRoleId: user.userRoleId });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
