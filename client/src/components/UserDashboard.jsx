import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserDashboard = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                if (!token) {
                    setError('No token found in localStorage');
                    return;
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                // Fetch the groups
                const response = await axios.get('http://localhost:3000/api/group/user-groups', config);
                console.log('API Response:', response.data);

                if (Array.isArray(response.data)) {
                    // Remove duplicate groups based on their IDs
                    const uniqueGroups = response.data.reduce((acc, group) => {
                        if (!acc.some(g => g._id === group._id)) {
                            acc.push(group);
                        }
                        return acc;
                    }, []);

                    setGroups(uniqueGroups);
                } else {
                    setGroups([]);
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
                setError('Failed to fetch groups.');
            }
        };

        fetchGroups();
    }, [token]);

    const handleGroupClick = (groupId) => {
        navigate(`/group/${groupId}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/');
    };

    const handleCreateGroup = () => {
        navigate(`/create-group/${userId}`);
    };

    const handleLeaveGroup = async (groupId) => {
        if (window.confirm('Are you sure you want to leave this group?')) {
            try {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };

                await axios.post('http://localhost:3000/api/user/leave-group', { groupId }, config);
                
                // Update the UI after successful leave
                setGroups(groups.filter(group => group._id !== groupId));
                alert('Successfully left the group.');
            } catch (error) {
                console.error('Error leaving group:', error);
                alert('Failed to leave the group.');
            }
        }
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <div className="text-2xl font-bold text-gray-800">Expense App</div>
                    <div className="space-x-4">
                        <button onClick={handleCreateGroup} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Create Group</button>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">Logout</button>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto p-6 flex flex-col flex-grow items-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Your Groups</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {groups.length === 0 ? (
                        <p className="text-lg text-gray-600">No groups found</p>
                    ) : (
                        groups.map((group) => (
                            <div
                                key={group._id}
                                className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-200 relative"
                                style={{ width: '220px', height: '150px' }} 
                                onClick={() => handleGroupClick(group._id)}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLeaveGroup(group._id);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    Leave
                                </button>
                                <h2 className="text-xl font-semibold mb-2">{group.name || 'No name'}</h2>
                                <p className="text-gray-700">{group.description || 'No description'}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
