import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import API from '../api/axios';

import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
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
      const { data } = await API.post('/auth/register', formData);

      login(data);

      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='name'
          placeholder='Name'
          onChange={handleChange}
        />

        <br />
        <br />

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

        <button type='submit'>Register</button>
      </form>
    </div>
  );
};

export default Register;
