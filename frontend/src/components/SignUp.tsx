import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (!name.trim() || !password.trim()) {
      setError('name and password are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/signup', {
        name,
        password,
      },{
        withCredentials:true
      });
      
      if(response.status === 200){
        navigate('/login')
        return null
      }

      setError('Failed to sign up. Please try again later.');

    } catch (err) {
      console.error('Signup failed:', err);
      setError('Failed to sign up. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-100 p-8 w-3/12 rounded-lg shadow-md">
        <h1 className="text-2xl text-black font-semibold mb-4">Sign Up</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="button" 
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
