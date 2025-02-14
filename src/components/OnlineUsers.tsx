import React from 'react';

interface OnlineUsersProps {
  users: string[];
  currentUser: string;
}

const OnlineUsers: React.FC<OnlineUsersProps> = ({ users, currentUser }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index} className={user === currentUser ? 'font-bold' : ''}>
            {user} {user === currentUser && '(me)'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;