import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../api/axios';

import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post('/auth/login', formData);

      login(data);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type='email'
          name='email'
          placeholder='Email'
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type='password'
          name='password'
          placeholder='Password'
          onChange={handleChange}
        />

        <br />
        <br />

        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
