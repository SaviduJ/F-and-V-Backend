import { NextApiRequest, NextApiResponse } from 'next';
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

    console.log('Incoming request data:', req.body);
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const userRoleId = 2; // Default user role ID

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user with the hashed password and default userRoleId
      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          userRoleId,
        },
      });

      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      console.error('Error creating user:', error); // Log the error
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
