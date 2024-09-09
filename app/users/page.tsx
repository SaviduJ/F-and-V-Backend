"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type User = {
    id: number;
    username: string;
    password: string;
    userRoleId: number;
};

type UserRole = {
    id: number;
    userRole: string;
};

const Users = () => {
    const [userRoleId, setUserRoleId] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isAddUserPopupOpen, setIsAddUserPopupOpen] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };

    useEffect(() => {
        fetch('/api/getUsers')
            .then((response) => response.json())
            .then((data: { users: User[], userRoles: UserRole[] }) => {
                setUsers(data.users);
                setUserRoles(data.userRoles);
            })
            .catch((error) => console.error('Error fetching users:', error));
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

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setEditingUser(null);
        setError(''); // Clear error on close
    };

    const handleAddUserClick = () => {
        setIsAddUserPopupOpen(true);
    };

    const handleCloseAddUserPopup = () => {
        setIsAddUserPopupOpen(false);
        setNewUsername('');
        setNewPassword('');
        setConfirmPassword('');
        setError(''); // Clear error on close
    };

    const handleRoleChange = async (userId: number, newRoleId: number) => {
        await fetch('/api/updateUserRole', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, newRoleId }),
        });
        setUsers(users.map(user => 
            user.id === userId ? { ...user, userRoleId: newRoleId } : user
        ));
    };

    const handleUserUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingUser) return;
    
        // Type assertion to let TypeScript know this is an HTMLFormElement
        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get('username') as string;
        const oldPassword = formData.get('oldPassword') as string;
        const newPassword = formData.get('newPassword') as string;
    
        // Validate and update user
        const response = await fetch('/api/updateUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: editingUser.id,
                oldPassword,
                newPassword,
                username,
            }),
        });
    
        if (response.ok) {
            // Update the user list with new data
            setUsers(users.map(user =>
                user.id === editingUser.id ? { ...user, username } : user
            ));
            handleClosePopup();
        } else {
            const result = await response.json();
            setError(result.error || 'An unexpected error occurred');
        }
    };

    const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        const response = await fetch('/api/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: newUsername,
                password: newPassword,
            }),
        });

        if (response.ok) {
            // Reload the users list
            const data = await response.json();
            setUsers([...users, data.user]);
            handleCloseAddUserPopup();
            
        } else {
            setError('Error adding user'); // Set error message
        }
    };

    if (userRoleId === null) {
       
    }

    const handleDeleteUser = async (id: number) => {
        // Show confirmation alert
        const isConfirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
    
        // Proceed with deletion if confirmed
        if (isConfirmed) {
            try {
                const response = await fetch('/api/deleteUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });
    
                if (response.ok) {
                    setUsers(users.filter(user => user.id !== id));
                } else {
                    const errorData = await response.json();
                    setError(`Error deleting user: ${errorData.message || 'Unknown error'}`);
                    console.error('Error deleting user:', errorData);
                }
            } catch (error) {
                setError('Error deleting user: Failed to communicate with the server.');
                console.error('Error deleting user:', error);
            }
        }
    };
    
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header onLogout={handleLogout} />
                <div className="flex-1 p-6">
                    <div className='flex justify-between'>
                        <h4 className="text-2xl font-bold mb-4">User Table</h4>
                        <button 
                            className="bg-gray-800 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            onClick={handleAddUserClick}
                        >
                            Add a User
                        </button>
                    </div>
                    <div className="relative overflow-x-auto mt-4 ml-2 rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400 rounded-t-lg">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Username</th>
                                    <th scope="col" className="px-6 py-3">User Role</th>
                                    <th scope="col" className="px-6 py-3">Edit</th>
                                    <th scope="col" className="px-6 py-3">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="rounded-b-lg">
                                {users.map((user) => (
                                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {user.username}
                                        </th>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.userRoleId}
                                                onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                                                className="border rounded-lg p-1"
                                            >
                                                {userRoles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.userRole}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-blue-600 hover:underline dark:text-blue-500"
                                                onClick={() => handleEditClick(user)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600 hover:underline dark:text-red-500">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isPopupOpen && editingUser && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Edit User</h2>
                            <form onSubmit={handleUserUpdate}>
                                <div className="mb-4">
                                    <label htmlFor="username" className="block text-gray-700">Username</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        defaultValue={editingUser.username}
                                        className="border rounded-lg p-2 w-full"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="oldPassword" className="block text-gray-700">Old Password</label>
                                    <input
                                        id="oldPassword"
                                        name="oldPassword"
                                        type="password"
                                        placeholder="Enter old password"
                                        className="border rounded-lg p-2 w-full"
                                    />
                                </div>
                                <div className="mb-4 relative">
                                    <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className="border rounded-lg p-2 w-full"
                                    />
                                     <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                         className="absolute inset-y-0 right-0 mt-5 pr-3 flex items-center text-sm leading-5"
                                           >
                                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                     </button>
                                </div>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                                        onClick={handleClosePopup}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-400 ml-4"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {isAddUserPopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                        <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                            <h2 className="text-xl font-bold mb-4">Add User</h2>
                            <form onSubmit={handleAddUser}>
                                <div className="mb-4">
                                    <label htmlFor="newUsername" className="block text-gray-700">Username</label>
                                    <input
                                        id="newUsername"
                                        name="newUsername"
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="border rounded-lg p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="block text-gray-700">Password</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="border rounded-lg p-2 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-4 relative">
                                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="border rounded-lg p-2 w-full"
                                        required
                                    />
                                     <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                         className="absolute inset-y-0 right-0 mt-5 pr-3 flex items-center text-sm leading-5"
                                           >
                                         <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                     </button>
                                </div>
                                {error && <p className="text-red-500 mb-4">{error}</p>}
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white font-semibold py-2 px-4 rounded hover:bg-gray-300"
                                        onClick={handleCloseAddUserPopup}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-400 ml-4"
                                    >
                                        Add User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
