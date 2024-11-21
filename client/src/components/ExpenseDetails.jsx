import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExpenseDetails = () => {
    const { expenseId } = useParams();
    const [expense, setExpense] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [proof, setProof] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [status, setStatus] = useState('');
    const [isStatusUpdated, setIsStatusUpdated] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const groupId = localStorage.getItem('groupId');

    useEffect(() => {
        const fetchExpenseDetails = async () => {
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

                const response = await axios.get(`http://localhost:3000/api/expenses/${expenseId}`, config);
                setExpense(response.data);
                setStatus(response.data.status);
            } catch (error) {
                console.error('Error fetching expense details:', error);
                setError('Failed to fetch expense details.');
            }
        };

        fetchExpenseDetails();
    }, [token, expenseId]);

    const handleStatusChange = async () => {
        try {
            if (!expense.proof && status === 'fulfilled') {
                alert('Upload proof before updating status');
                return;
            }

            const response = await axios.put(
                `http://localhost:3000/api/expenses/${groupId}/update-status/${expenseId}`,
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSuccess('Expense status updated successfully.');
            setExpense((prev) => ({ ...prev, status }));
            setIsStatusUpdated(true);
        } catch (error) {
            console.error('Error updating expense status:', error);
            setError('Failed to update expense status.');
        }
    };

    const handleProofChange = (e) => {
        const file = e.target.files[0];
        setProof(file);
        setProofPreview(URL.createObjectURL(file));
    };

    const handleProofUpload = async () => {
        try {
            if (!proof) {
                setError('Please select a proof file to upload.');
                return;
            }

            const formData = new FormData();
            formData.append('proof', proof);

            const response = await axios.post(
                `http://localhost:3000/api/expenses/${groupId}/upload-proof/${expenseId}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSuccess('Proof uploaded successfully.');
            setExpense((prev) => ({ ...prev, proof: response.data.proof }));
            alert('Proof uploaded successfully.');
        } catch (error) {
            console.error('Error uploading proof:', error);
            setError('Failed to upload proof.');
        }
    };

    const handleVerifyProof = async () => {
        try {
            const response = await axios.put(
                `http://localhost:3000/api/expenses/${groupId}/update-status/${expenseId}`,
                { status: 'verified' },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSuccess('Expense status updated to verified.');
            setExpense((prev) => ({ ...prev, status: 'verified' }));
        } catch (error) {
            console.error('Error verifying proof:', error);
            setError('Failed to verify proof.');
        }
    };

    useEffect(() => {
        // Cleanup proof preview URL when component unmounts
        return () => {
            if (proofPreview) {
                URL.revokeObjectURL(proofPreview);
            }
        };
    }, [proofPreview]);

    const isPayer = expense?.payer?._id === userId;
    const isAssignee = expense?.assignee?._id === userId;

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <nav className="bg-white shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4 ml-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                    >
                        Back To GroupDashboard
                    </button>
                </div>
            </nav>
            <div className="container mx-auto p-6 flex flex-col flex-grow mx-8">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                {expense ? (
                    <div className="bg-white p-6 rounded shadow-md space-y-4" style={{ maxWidth: '96%' }}>
                        <h1 className="text-3xl font-bold mb-4">Expense Details</h1>
                        <div className="text-lg">
                            <p className="mb-2"><strong>Cost:</strong> {expense.cost}</p>
                            <p className="mb-2"><strong>Purpose:</strong> {expense.purpose}</p>
                            <p className="mb-2"><strong>Payer:</strong> {expense.payer?.name}</p>
                            <p className="mb-2"><strong>Assignee:</strong> {expense.assignee?.name}</p>
                            <p className="mb-4"><strong>Status:</strong> {expense.status}</p>

                            {isPayer && !isStatusUpdated && (
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Update Status</label>
                                        <select
                                            id="status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="fulfilled">Fulfilled</option>
                                        </select>
                                    </div>
                                    {status === 'fulfilled' && (
                                        <div>
                                            <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Upload Proof</label>
                                            <input
                                                type="file"
                                                id="proof"
                                                onChange={handleProofChange}
                                                className="mt-1 block w-full text-sm"
                                            />
                                            {proofPreview && (
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700">Proof Preview</label>
                                                    <img src={proofPreview} alt="Proof Preview" className="mt-2 rounded-md max-w-xs"/>
                                                </div>
                                            )}
                                            <button
                                                onClick={handleProofUpload}
                                                className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Upload Proof
                                            </button>
                                        </div>
                                    )}
                                    <button
                                        onClick={handleStatusChange}
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Update Status
                                    </button>
                                </div>
                            )}

                            {expense.proof && (
                                <div className="mt-4">
                                    <label htmlFor="proof-view" className="block text-sm font-medium text-gray-700">Proof</label>
                                    <a
                                        href={`http://localhost:3000/uploads/${expense.proof}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 block text-blue-600 underline"
                                    >
                                        View Proof
                                    </a>
                                </div>
                            )}

                            {!isPayer && (
                                <div>
                                    <label htmlFor="proof" className="block text-sm font-medium text-gray-700">Proof</label>
                                    {expense.proof ? (
                                        <a
                                            href={`http://localhost:3000/uploads/${expense.proof}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 block text-blue-600 underline"
                                        >
                                            View Proof
                                        </a>
                                    ) : (
                                        <p className="text-gray-500 mt-1">No proof uploaded yet.</p>
                                    )}
                                </div>
                            )}

                            {isAssignee && expense.status === 'fulfilled' && (
                                <button
                                    onClick={handleVerifyProof}
                                    className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Verify Proof
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Loading expense details...</p>
                )}
            </div>
        </div>
    );
};

export default ExpenseDetails;
