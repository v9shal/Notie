import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from './features/auth/authSlice';
import ProtectedRoute from './ProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import PageNotFound from './components/PageNotFound';
import Todo from './components/Todo';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state: { auth: { isAuthenticated: boolean } }) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/islogin', { withCredentials: true });
        if (response.data.success) {
          dispatch(setCredentials({ token: response.data.token, username: response.data.user.username }));
          navigate('/todo');
        }
      } catch (error) {
        console.log('User is not authenticated:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, [dispatch, navigate]);

  if (loading) {
    // You can return a loading spinner or null here
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/todo" /> : <Navigate to="/login" />} />
      <Route path='/register' element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
      <Route path="/todo" element={<ProtectedRoute element={<Todo />} />} />
    </Routes>
  );
}

export default App;