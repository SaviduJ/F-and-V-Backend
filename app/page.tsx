"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated (e.g., by checking a token or user ID in localStorage)
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // If no token, redirect to the login page
      router.push('/login');
    } else {
      // If authenticated, redirect to the dashboard or another authenticated page
      router.push('/dashboard');
    }
  }, [router]);

  return <div>Redirecting...</div>;
};

export default HomePage;
