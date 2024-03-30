import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await axios.post('/api/auth/register', {
        name,
        username,
        email,
        password,
        mobileNumber,
      });
  
      if (password !== passwordConfirmation) {
        alert('Passwords do not match');
        return;
      }
  
      navigate('/login');
    } catch (error) {
      if (error.response.status === 400) {
        alert('Username already exists');
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
      <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} placeholder="Confirm password" />
      <input type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="Enter mobile number" />
      <button type="submit">Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
};

export default Register;