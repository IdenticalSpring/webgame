import { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import UserDetailModal from './user-modals/UserDetailModal';
import UserEditModal from './user-modals/UserEditModal';
import UserBanModal from './user-modals/UserBanModal';
import UserDeleteModal from './user-modals/UserDeleteModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/user')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (user, type) => {
    setSelectedUser(user);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  const handleSaveUser = (updatedUser) => {
    fetch(`/api/admin/user/${updatedUser.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedUser)
    })
    .then(response => response.json())
    .then(data => {
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
      handleCloseModal();
    })
    .catch(error => console.error('Error updating user:', error));
  };

  const handleBanUser = (user) => {
    fetch(`/api/admin/user/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ban: user.ban === 1 ? 0 : 1 })
    })
    .then(response => response.json())
    .then(data => {
      setUsers(users.map(u => u.id === user.id ? { ...u, ban: user.ban === 1 ? 0 : 1 } : u));
    })
    .catch(error => console.error('Error banning user:', error));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <h1>User Management</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Ban Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.ban === 1 ? 'Banned' : 'Active'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenModal(user, 'details')}>Details</Button>
                  <Button onClick={() => handleOpenModal(user, 'edit')}>Edit</Button>
                  <Button onClick={() => handleBanUser(user)}>{user.ban === 1 ? 'Unban' : 'Ban'}</Button>
                  <Button onClick={() => handleOpenModal(user, 'delete')}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedUser && modalType === 'details' && (
        <UserDetailModal user={selectedUser} onClose={handleCloseModal} />
      )}
      {selectedUser && modalType === 'edit' && (
        <UserEditModal user={selectedUser} onClose={handleCloseModal} onSave={handleSaveUser} />
      )}
      {selectedUser && modalType === 'ban' && (
        <UserBanModal user={selectedUser} onClose={handleCloseModal} />
      )}
      {selectedUser && modalType === 'delete' && (
        <UserDeleteModal user={selectedUser} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserManagement;
