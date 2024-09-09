"use client";


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Popup from '../components/Popup';

interface Route {
  id: number;
  routesName: string;
  status: number | null;
  Good: string,              
  Rejected:string,
}

interface Location{
  id: number,    
  name: string,
  phoneNumber:true,
  routeId: number,
}


interface savedText {
  id: number;
  locationId: number,
  savedText: string,
}

const statusOptions = [
  { value: 0, label: 'No Status' },
  { value: 1, label: 'Field Officer' },
  { value: 2, label: 'Collecting Person' },
  { value: 3, label: 'Factory Manager' },
  { value: 4, label: 'Completed' },
];

const RoutesPage = () => {
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  const [isInfoPopupOpen, setInfoPopupOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [locations, setLocations] = useState<Location[]>([]); // State for locations
  const [savedTexts, setSavedTexts] = useState<savedText[]>([]);
  const [newRoutesName, setnewRoutesName] = useState('');
  const handleButtonClick = () => setPopupVisible(true);
  const handleClosePopup = () => setPopupVisible(false);

  

  useEffect(() => {
    const fetchUserRoleId = async () => {
      const storedUserRoleId = localStorage.getItem('userRoleId');
      if (storedUserRoleId) {
        setUserRoleId(parseInt(storedUserRoleId, 10));
      } else {
        router.push('/login');
      }
    };

    fetchUserRoleId();
  }, [router]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/getRoutes'); // Update with your actual API URL
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      setError('Failed to load routes');
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleEditClick = (route: Route) => {
    setSelectedRoute(route);
    setnewRoutesName(route.routesName); // Reset the input field
    setEditPopupOpen(true); // Open the edit popup
  };

  const handleInfoClick = async (route: Route) => {
    try {
        // Fetch locations
        const locationsResponse = await fetch(`/api/getLocationDetails`);
        if (!locationsResponse.ok) {
            throw new Error('Failed to fetch locations');
        }
        const locationsData = await locationsResponse.json();

        // Fetch saved texts
        const savedTextResponse = await fetch(`/api/getSavedText`);
        if (!savedTextResponse.ok) {
            throw new Error('Failed to fetch saved texts');
        }
        const savedTextsData = await savedTextResponse.json();

        // Filter locations related to the selected route
        const filteredLocations = locationsData.filter(
            (location: Location) => location.routeId === route.id
        );

        // Set the filtered data
        setLocations(filteredLocations);
        setSavedTexts(savedTextsData);
        setSelectedRoute(route); // Set selected route
        setInfoPopupOpen(true); // Open the info popup
    } catch (error) {
        setError('Failed to load locations or saved texts');
    }
};


  const handlePopupSuccess = () => {
    fetchRoutes(); // Refresh routes list after adding a new route
  };

  const handleUsernameUpdate = async () => {
    if (selectedRoute) {
      try {
        const response = await fetch('/api/updateRoute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: selectedRoute.id, routesName: newRoutesName }),
        });

        if (response.ok) {
          // Close popup and refresh routes
          setEditPopupOpen(false);
          fetchRoutes();
        } else {
          setError('Failed to update username');
        }
      } catch (error) {
        setError('Error updating username');
      }
    }
  };

  const handleStatusChange = async (routeId: number, newStatus: number) => {
    try {
      const response = await fetch('/api/updateRoute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: routeId, status: newStatus }),
      });
  
      if (response.ok) {
        // Instead of fetching all routes again, update only the relevant route in state
        setRoutes((prevRoutes) =>
          prevRoutes.map((route) =>
            route.id === routeId ? { ...route, status: newStatus } : route
          )
        );
      } else {
        console.error('Error updating status');
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };
  
  const handleDeleteClick = async (routeId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this route?');

    if (confirmDelete) {
      try {
        const response = await fetch('/api/deleteRoute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: routeId }),
        });

        if (response.ok) {
          // Refresh routes after deletion
          fetchRoutes();
        } else {
          console.error('Error deleting route');
        }
      } catch (error) {
        console.error('Error deleting route', error);
      }
    }
  };

  const handleResetClick = async (routeId: number) => {
    try {
      await handleStatusChange(routeId, 0); // Reset status to 0
      fetchRoutes(); // Refresh routes after resetting
    } catch (error) {
      console.error('Error resetting route status', error);
    }
  };

  const activeRoutes = routes.filter((route) => route.status !== 4);
  const completedRoutes = routes.filter((route) => route.status === 4);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header onLogout={() => router.push('/login')} />
        <div className="overflow-y-auto p-6">
         <div className='flex justify-between'>
         <h2 className="text-2xl font-bold mb-4">Routes</h2>
            <button
              onClick={handleButtonClick}
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Route
            </button>
            <Popup isVisible={isPopupVisible} onClose={handleClosePopup} onSuccess={handlePopupSuccess} />
          </div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Routes Name</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Edit </th>
                  <th className="px-6 py-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {activeRoutes.map((route) => (
                  <tr
                    key={route.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {route.routesName}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={route.status ?? 0}
                        onChange={(e) =>
                          handleStatusChange(route.id, parseInt(e.target.value, 10))
                        }
                        className="border rounded-lg p-2 w-full"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEditClick(route)}
                      >
                        Edit 
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteClick(route.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="relative overflow-x-auto mt-8">
            <h3 className="text-xl font-bold mb-4">Completed Routes</h3>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Routes Name</th>
                  <th className="px-6 py-3">Reset Route</th>
                  <th className="px-6 py-3">Info</th>
                  <th className="px-6 py-3">Delete</th>
                  
                </tr>
              </thead>
              <tbody>
                {completedRoutes.map((route) => (
                  <tr
                    key={route.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {route.routesName}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="className= text-blue-500 hover:underline"
                        onClick={() => handleResetClick(route.id)}
                      >
                        Reset Route
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleInfoClick(route)}
                      >
                       info
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeleteClick(route.id)}
                      >
                        Delete
                      </button>
                    </td>
                   
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          
      </div>

      {isEditPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUsernameUpdate();
              }}
            >
              <div className="mb-4">
                <label htmlFor="newRoutesName" className="block text-gray-700">
                  Route Name
                </label>
                <input
                  id="newRoutesName"
                  name="newRoutesName"
                  type="text"
                  value={newRoutesName}
                  onChange={(e) => setnewRoutesName(e.target.value)}
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                  onClick={() => setEditPopupOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-400 ml-4"
                >
                  Update RoutesName
                </button>
              </div>
            </form>
          </div>
            
        </div>
      )}
      {isInfoPopupOpen && selectedRoute && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
      {/* Factory Manager Info Section */}
      <h2 className="text-xl font-bold mb-4">Factory Manager Info</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Route Name:</label>
        <p>{selectedRoute.routesName}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Good Amount:</label>
        <p>{selectedRoute.Good}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Rejected Amount:</label>
        <p>{selectedRoute.Rejected}</p>
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Collecting Person Info Section */}
      <h2 className="text-xl font-bold mb-4">Collecting Person Info</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Locations and Saved Texts:</label>
        <ul>
          {locations
            .filter(location => location.routeId === selectedRoute.id)
            .map(location => (
              <li key={location.id} className="mb-2">
                <div>
                  <span className="font-semibold">Shop Name: </span>{location.name}
                </div>
                <div>
                  <span className="font-semibold">Saved Text: </span>
                  {savedTexts.find(st => st.locationId === location.id)?.savedText || 'No saved text'}
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* Close Button */}
      <div className="flex justify-end">
        <button
          className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
          onClick={() => setInfoPopupOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default RoutesPage;
