import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddMembers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { groupId } = useParams();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/allUsers', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to fetch users.');
            }
        };

        fetchUsers();
    }, [token]);

    useEffect(() => {
        const filterUsers = () => {
            const lowercasedEmail = email.toLowerCase();
            const filtered = users.filter(user =>
                user.email.toLowerCase().includes(lowercasedEmail)
            );
            setFilteredUsers(filtered);
        };

        filterUsers();
    }, [email, users]);

    const handleAddMember = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:3000/api/user/add-member', { email, groupId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setSuccess(response.data.message);
        } catch (error) {
            console.error('Error adding member:', error);
            setError('Failed to add member.');
        }
    };

    const handleBackToDashboard = () => {
        navigate(`/group/${groupId}`);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto flex justify-start items-center p-4">
                    <button
                        onClick={handleBackToDashboard}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Back To GroupDashboard
                    </button>
                </div>
            </nav>
            <div className="container mx-auto p-6 flex flex-col flex-grow items-start">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Add Members</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleAddMember} className="w-full max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            User Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Add Member
                    </button>
                </form>
                <h2 className="text-2xl font-semibold mt-6 mb-4">All Users:</h2>
                <ul className="list-disc pl-5">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <li key={user._id} className="text-gray-700">{user.name} ({user.email})</li>
                        ))
                    ) : (
                        <p className="text-gray-700">No users found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
    
};

export default AddMembers;
