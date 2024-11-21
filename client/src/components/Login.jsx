import React, {useState} from "react";
import { useNavigate, useParams,  Link } from "react-router-dom";
import axios from 'axios';

const Login=({})=>{
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [error, setError]=useState('');
    const navigate=useNavigate();
    const {id}=useParams();

    const handleSubmit=async(e)=>{
        e.preventDefault();

        console.log('Login attempt with email:', email);

        try {
            const response=await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {email, password});

            const {token, result}=response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('userId', result._id);
            navigate(`/user-dashboard/${result._id}`);
        } catch (error) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex flex-col items-center justify-center flex-grow bg-gray-100">
                <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    {error&&<div>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input 
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input 
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <button
                                type="submit"
                                className="w-48 bg-gray-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Login
                            </button>
                            <Link
                                to="/register"
                                className="w-48 bg-gray-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                            >
                                Register
                            </Link>
                            <Link
                                to="/"
                                className="w-48 bg-gray-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-center"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;