import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(' ');

  useEffect(() => {
    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        console.log(token);
      
        if (!token) {
          console.error('No token found');
          return;
        }
      
        axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => {
          setProfile(response.data);
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            console.error('Unauthorized: Invalid or expired token');
            console.error(error);
          } else {
            console.error(error.message);
          }
        });
      };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{profile.username}</h1>
      <p>{profile.email}</p>
    </div>
  );
};

export default Profile;