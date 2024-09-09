"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Popup from '../components/Popup'; // Ensure you have the Popup component imported

interface Route {
  id: number;
  routesName: string;
  fieldOfficerId: number | null; // Add this to hold the assigned field officer ID
  collectingPersonId: number;
  factoryManagerId: number;
  fieldOfficerAssignDate:string;
  collectingPersonAssignDate:string;
  factoryManagerAssignDate:string;
  status: number | null;
}

type User = {
  id: number;
  username: string;
  userRoleId: number;
  
};

const DashboardPage = () => {
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [assignedFieldOfficer, setAssignedFieldOfficer] = useState<User[]>([]);
  const [assignedcollectinPerson,setAssignedCollectingPerson] = useState<User[]>([]);
  const[assignedFactoryManger,setAssignedFactoryManger]= useState<User[]>([]);
  const handleButtonClick = () => setPopupVisible(true);
  const handleClosePopup = () => setPopupVisible(false);

  const fetchRoutes = async () => {
    try {
      const response = await fetch('/api/getRoutes'); // Update with your actual API URL
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/getUsers'); // Update with your actual API URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data.users);

        // Filter users with userRoleId equal to 2
        const filteredFieldOfficer = data.users.filter((user: User) => user.userRoleId === 2);
        setAssignedFieldOfficer(filteredFieldOfficer);

        const filteredcollectingPerson = data.users.filter((user: User) => user.userRoleId === 3);
        setAssignedCollectingPerson(filteredcollectingPerson);

         const filteredFactoryManger = data.users.filter((user: User) => user.userRoleId === 6);
         setAssignedFactoryManger(filteredFactoryManger);

      } catch (error) {
        console.error('Error fetching users:', error);
      }

      // Filter users with userRoleId equal to 3
     
    };

    fetchUsers();
  }, []);

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

  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRoleId');
    router.push('/login');
  };

  const handleAssignFieldOfficer = async (routeId: number, fieldOfficerId: number) => {
    try {
      const response = await fetch('/api/assignFieldOfficer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routeId, fieldOfficerId }),
      });
  
      if (response.ok) {
        
        const fieldOfficerAssignDate =  new Date(new Date().getTime()).toLocaleString('en-UK', { timeZone: 'Asia/Kolkata', hour12: true, });
        setRoutes(routes.map(route =>
          route.id === routeId ? { ...route, fieldOfficerId, fieldOfficerAssignDate } : route
        ));
      } else {
        setError('Error assigning field officer');
        console.error('Error assigning field officer:', await response.json());
      }
    } catch (error) {
      setError('Error assigning field officer');
      console.error('Error assigning field officer:', error);
    }
  };

  const handleAssignPerson = async (routeId: number, collectingPersonId: number) => {
    try {
      const response = await fetch('/api/assignCollectingPerson', { // Adjust API endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routeId, collectingPersonId }),
      });
  
      if (response.ok) {
        // Update the route list with the new person assignment
        const collectingPersonAssignDate =  new Date(new Date().getTime()).toLocaleString('en-UK', { timeZone: 'Asia/Kolkata', hour12: true, });
        setRoutes(routes.map(route =>
          route.id === routeId ? { ...route, collectingPersonId,collectingPersonAssignDate } : route
        ));
      } else {
        setError('Error assigning person');
        console.error('Error assigning person:', await response.json());
      }
    } catch (error) {
      setError('Error assigning person');
      console.error('Error assigning person:', error);
    }
  };

  const handleAssignManager = async (routeId: number, factoryManagerId: number) => {
    try {
      const response = await fetch('/api/assignManager', { // Adjust API endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ routeId, factoryManagerId }),
      });
  
      if (response.ok) {
        // Update the route list with the new person assignment
        const factoryManagerAssignDate =  new Date(new Date().getTime()).toLocaleString('en-UK', { timeZone: 'Asia/Kolkata', hour12: true, });
        setRoutes(routes.map(route =>
          route.id === routeId ? { ...route, factoryManagerId,factoryManagerAssignDate } : route
        ));
      } else {
        setError('Error assigning Manager');
        console.error('Error assigning Manager:', await response.json());
      }
    } catch (error) {
      setError('Error assigning Manager');
      console.error('Error assigning Manager:', error);
    }
  };
  

  const handlePopupSuccess = () => {
    fetchRoutes(); // Refresh routes list after adding a new route
  };

  if (userRoleId === null) {
   
  }

  const activeRoutes = routes.filter((route) => route.status !== 4);

  return (
    <div className="flex  h-screen ">
      <Sidebar />
      <div className="flex-1 flex flex-col ">
        <Header onLogout={handleLogout} />
        <div className=' overflow-y-auto'>
        <div className="flex-1 p-6">
          <div className='flex justify-between'>
            <h2 className="text-2xl font-bold mb-4">Field Officer Routes</h2>
            <button
              onClick={handleButtonClick}
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Route
            </button>
            <Popup isVisible={isPopupVisible} onClose={handleClosePopup} onSuccess={handlePopupSuccess} />
          </div>
          <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      <th scope="col" className="px-6 py-3">
        Routes Name
      </th>
      <th scope="col" className="px-6 py-3">
        Assign
      </th>
      <th scope="col" className="px-6 py-3">
        Assign Date
      </th>
    </tr>
  </thead>
  <tbody>
    {activeRoutes.map((route) => (
      <tr key={route.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {route.routesName}
        </th>
        <td className="px-6 py-4">
          <select
            className="border rounded-lg p-2 w-full"
            value={route.fieldOfficerId || ''}
            onChange={(e) => handleAssignFieldOfficer(route.id, parseInt(e.target.value, 10))}
          >
            <option value="">Select User</option>
            {assignedFieldOfficer.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4">
          {route.fieldOfficerAssignDate || 'Not Assigned'}
        </td>
      </tr>
    ))}
  </tbody>
</table>

          </div>
          <h2 className="text-2xl font-bold mt-4">Collecting Person Routes</h2>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Routes Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assign
                  </th>
                  <th scope="col" className="px-6 py-3">
                   Assign Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeRoutes.map((route) => (
                  <tr key={route.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {route.routesName}
                    </th>
                    <td className="px-6 py-4">
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={route.collectingPersonId || ''}
                        onChange={(e) => handleAssignPerson(route.id, parseInt(e.target.value, 10))}
                      >
                        <option value="">Select User</option>
                        {assignedcollectinPerson.map((user: User) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                     {route. collectingPersonAssignDate || 'Not Assigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 
          </div>
          <h2 className="text-2xl font-bold mt-4">Factory Manger Routes</h2>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Routes Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Assign
                   </th>
                  <th scope="col" className="px-6 py-3">
                  Assign Date
                   </th>
                </tr>
              </thead>
              <tbody>
                {activeRoutes.map((route) => (
                  <tr key={route.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {route.routesName}
                    </th>
                    <td className="px-6 py-4">
                      <select
                        className="border rounded-lg p-2 w-full"
                        value={route.factoryManagerId || ''}
                        onChange={(e) => handleAssignManager(route.id, parseInt(e.target.value, 10))}
                      >
                        <option value="">Select User</option>
                        {assignedFactoryManger.map((user: User) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                     {route.factoryManagerAssignDate || 'Not Assigned'}
                     </td>
                  </tr>
                ))}
              </tbody>
            </table> 
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
