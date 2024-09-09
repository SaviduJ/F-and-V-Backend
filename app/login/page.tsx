"use client";  // Mark this as a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        const { token, userId, userRoleId } = result;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('userRoleId', userRoleId.toString());

        if (userRoleId == 2) {
          router.push('/dashboard');
        } else {
          setMessage('User role not recognized');
        }
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Error logging in');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          onClick={handleLogin}
        >
          Login
        </button>
        {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
