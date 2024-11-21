import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const GroupDashboard = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (groupId) {
            localStorage.setItem('groupId', groupId);
        }
        const fetchGroupDetails = async () => {
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

                // Fetch group details
                const response = await axios.get(`http://localhost:3000/api/group/details/${groupId}`, config);
                setGroup(response.data);
            } catch (error) {
                setError('Failed to fetch group details.');
            }
        };

        const fetchGroupExpenses = async () => {
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

                // Fetch group expenses
                const response = await axios.get(`http://localhost:3000/api/expenses/group/${groupId}/expenses`, config);
                setExpenses(response.data);
            } catch (error) {
                setError('Failed to fetch group expenses.');
            }
        };

        fetchGroupDetails();
        fetchGroupExpenses();
    }, [token, groupId]);

    const handleRemoveMember = async (memberId) => {
        try {
            const response = await axios.post(
                'http://localhost:3000/api/user/remove-member',
                { groupId, userId: memberId },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setSuccess(response.data.message);
            // Refresh the group details after removing a member
            setGroup(prevGroup => ({
                ...prevGroup,
                members: prevGroup.members.filter(member => member.user._id !== memberId)
            }));
        } catch (error) {
            setError('Failed to remove member.');
        }
    };

    const handleBack = () => {
        navigate(`/user-dashboard/${userId}`);
    };

    const handleAdd = () => {
        navigate(`/add-members/${groupId}`);
    };

    const handleExpense = () => {
        navigate(`/create-expense/${groupId}`);
    };

    const handleDeleteGroup = async () => {
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

            const response = await axios.delete(`http://localhost:3000/api/group/delete/${groupId}`, config);
            setSuccess(response.data.message);
            navigate(`/user-dashboard/${userId}`);
        } catch (error) {
            setError('Failed to delete group.');
        }
    };

    const isAdmin = group?.members.some(member => member.user._id === userId && member.role === 'admin');

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    <button onClick={handleBack} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Back to Dashboard</button>
                    <div className="flex space-x-4">
                        {isAdmin && (
                            <button onClick={handleDeleteGroup} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200">
                                Delete Group
                            </button>
                        )}
                        <button onClick={handleAdd} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Add Members</button>
                        <button onClick={handleExpense} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Create Expense</button>
                    </div>
                </div>
            </nav>
            <div className="container mx-auto p-6 flex flex-col flex-grow items-start">
                {group ? (
                    <>
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">{group.name}</h1>
                        <p className="text-lg text-gray-600 mb-4">{group.description}</p>
                        <h2 className="text-2xl font-semibold mb-4">Members:</h2>
                        <ul className="list-disc pl-5">
                            {group.members.map(member => (
                                <li key={member._id} className="text-gray-700">
                                    {member.user.name} ({member.role})
                                    {isAdmin && member.role === 'member' && (
                                        <button
                                            onClick={() => handleRemoveMember(member.user._id)}
                                            className="ml-1 bg-red-500 text-white text-xs px-0.5 py-0.5 rounded-sm hover:bg-red-700 transition duration-200"
                                        >
                                            Remove
                                        </button>                                    
                                    )}
                                </li>
                            ))}
                        </ul>
                        <h2 className="text-2xl font-semibold mt-6 mb-4">Expenses:</h2>
                        {expenses.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {expenses.map(expense => (
                                    <div
                                        key={expense._id}
                                        className="bg-white p-4 shadow-md rounded-md cursor-pointer hover:shadow-lg transition-shadow"
                                        onClick={() => navigate(`/expense/${expense._id}`)}
                                    >
                                        <h3 className="text-xl font-semibold mb-2">{expense.purpose}</h3>
                                        <p className="text-gray-700">Amount: {expense.cost}</p>
                                        <p className="text-gray-700">Assignee: {expense.assignee.name}</p>
                                        <p className="text-gray-700">Payer: {expense.payer.name}</p>
                                        <p className="text-gray-700">Status: {expense.status}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-lg text-gray-600">No expenses were found.</p>
                        )}
                    </>
                ) : (
                    <p className="text-lg text-gray-600">Loading group details...</p>
                )}
            </div>
        </div>
    );
};

export default GroupDashboard;