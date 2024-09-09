"use client";

import React, { useState } from 'react';

interface PopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void; // Add this prop
}

const Popup: React.FC<PopupProps> = ({ isVisible, onClose, onSuccess }) => {
  const [routeName, setRouteName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isVisible) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!routeName) {
      setError('Route Name is required');
      return;
    }

    try {
      const response = await fetch('/api/addRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routesName: routeName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add route');
        return;
      }

      setRouteName('');
      setError(null);
      onSuccess(); // Call the onSuccess callback
      onClose();
    } catch (error) {
      setError('Failed to add route');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Add New Route</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Route Name:
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              required
            />
          </label>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
