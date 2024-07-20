import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/paid-users'); // Endpoint to get all paid users
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="sidebar">
      {users.map((user) => (
        <div key={user.id} className="sidebar-item" onClick={() => onSelectUser(user.id)}>
          {user.username}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
