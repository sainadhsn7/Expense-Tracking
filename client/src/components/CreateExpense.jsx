import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateExpense = () => {
    const { groupId } = useParams();
    const [cost, setCost] = useState('');
    const [purpose, setPurpose] = useState('');
    const [payers, setPayers] = useState([]);
    const [selectedPayers, setSelectedPayers] = useState([]);
    const [assigneeName, setAssigneeName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/group/details/${groupId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                const members = response.data.members.map(member => ({
                    id: member.user._id,
                    name: member.user.name
                }));
                setPayers(members);

                // Set default assignee to the current user
                const currentUser = members.find(member => member.id === currentUserId);
                setAssigneeName(currentUser ? currentUser.name : '');

                // Optionally set the current user as selected payer
                setSelectedPayers([currentUserId]);
            } catch (error) {
                console.error('Error fetching group details:', error);
                setError('Failed to fetch group details.');
            }
        };

        fetchGroupDetails();
    }, [groupId, token, currentUserId]);

    const handlePayerChange = (e) => {
        const { options } = e.target;
        const selected = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setSelectedPayers(selected);
    };

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const expenseData = {
                cost,
                purpose,
                payer: selectedPayers,
                assignee: currentUserId
            };

            console.log('Sending expense data:', expenseData); // Log the request payload

            const response = await axios.post(
                `http://localhost:3000/api/expenses/group/${groupId}/createExpense`,
                expenseData,
                config
            );

            console.log(response);

            setSuccess('Expense created successfully');
            setCost('');
            setPurpose('');
            setSelectedPayers([]);
        } catch (error) {
            console.error('Error creating expense:', error);
            setError('Failed to create expense.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md relative">
                <h1 className="text-2xl font-bold mb-4">Create Expense</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Cost</label>
                        <input
                            type="number"
                            id="cost"
                            name="cost"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose</label>
                        <input
                            type="text"
                            id="purpose"
                            name="purpose"
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="relative mb-4">
                        <label htmlFor="payer" className="block text-sm font-medium text-gray-700">Payer</label>
                        <div
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-pointer"
                            onClick={handleDropdownToggle}
                        >
                            <span className="block text-gray-700">
                                {selectedPayers.length > 0
                                    ? payers.filter(payer => selectedPayers.includes(payer.id)).map(payer => payer.name).join(', ')
                                    : 'Select Payers'}
                            </span>
                            <svg
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        {dropdownOpen && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                <select
                                    multiple
                                    value={selectedPayers}
                                    onChange={handlePayerChange}
                                    className="block w-full p-2 border-none focus:outline-none"
                                >
                                    {payers.map(payer => (
                                        <option key={payer.id} value={payer.id}>
                                            {payer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700">Assignee</label>
                        <input
                            type="text"
                            id="assignee"
                            name="assignee"
                            value={assigneeName}
                            readOnly
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none sm:text-sm"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                        >
                            Create Expense
                        </button>
                        <button
                            type="button"
                            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none"
                            onClick={() => navigate(`/group/${groupId}`)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExpense;