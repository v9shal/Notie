import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const navigate=useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
    
        try {
          const response = await axios.post('http://localhost:8080/auth/register', 
            { username, password }, 
            { withCredentials: true } // Needed to store the cookie with token
          );

          // Logging full response to inspect it
          console.log('Response:', response);

          if (response.status === 201) {
            console.log("Registered successfully");

            // Assuming the token is returned in response.data or response.headers
            const tokenReceived = response.data.token || response.headers['auth-token']; 

            // Set token in the state
            setToken(tokenReceived);
            navigate('/login')
            // Log token to console
            console.log('Token:', tokenReceived);
          }
        } catch (err) {
          console.error('Registration error:', err);
          setError('Error while registering. Please try again.');
        }
      };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700">Username:</label>
                        <input
                            type="text"
                            id="username"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                        Register
                    </button>
                </form>
            </div>
            
            {/* Display token */}
            <div className="mt-4">
                <h3 className="text-xl font-bold">Token:</h3>
                <p>{token || 'No token received yet'}</p>
            </div>
        </div>
    );
};

export default Register;
