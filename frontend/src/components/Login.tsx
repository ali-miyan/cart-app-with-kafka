import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setToken } from "../store/Auth";

const Login: React.FC = () => {
  const [name, setname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>('');
  const navigate = useNavigate()
  const dispatch = useDispatch();


  const handleLogin = async () => {
    if (!name.trim() || !password.trim()) {
      setError("name and password are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/login", {
        name,
        password,
      },{
        withCredentials:true
      });

      
      if (response.status === 200) {
        dispatch(setToken(response.data.token));
        navigate('/');
      } else {
        setError('Failed to sign up. Please try again later.');
      }
      setError("Failed to sign up. Please try again later.");

    } catch (err) {
      console.error("login failed:", err);
      setError("Failed to sign up. Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-100 w-3/12 p-8 rounded-lg shadow-md">
      {error && <div className="text-red-500 mb-4">{error}</div>}
        <h1 className="text-2xl text-black font-semibold mb-4">Login</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              name
            </label>
            <input
              type="text"
              id="name"
              className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
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
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
