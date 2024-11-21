import React from 'react';
import { Link } from 'react-router-dom';

const Home=()=>{
    return (
        <div>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <nav className="bg-white shadow-md">
                    <div className="container mx-auto flex justify-between items-center p-4">
                        <div className="text-2xl font-bold text-gray-800 mx-6">Expense App</div>
                        <div className="space-x-4">
                            <Link to="/login" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Login</Link>
                            <Link to="/register" className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">Register</Link>
                        </div>
                    </div>
                </nav>
                <div className="flex flex-col flex-grow items-center justify-center p-6">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Welcome to the Expense Sharing App</h1>
                    <p className="text-lg text-gray-600 mb-8 text-center">Easily manage and share expenses with your groups</p>
                    <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;