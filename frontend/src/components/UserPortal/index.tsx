import React, { useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { getUserList, deleteUser, updateUser } from '../../services/user.service';

enum UserType {
  Admin = 0,
  Common = 1,
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
}

const UserPortal: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);

    const userType: UserType = UserType.Common;

    const userTypeToString = (userType: UserType): string => {
        switch (userType) {
          case UserType.Admin:
            return 'Admin';
          case UserType.Common:
            return 'Common';
          default:
            return '';
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const userList = await getUserList();
        const filteredUsers = Array.isArray(userList) ? userList.filter((user: User) => user.id === 1) : [];
        setUsers(filteredUsers);
    };

    const handleDelete = async (id: number) => {
        if (UserType.Admin) {
        await deleteUser(id);
        fetchUsers();
        } else {
        alert("Você não tem permissão para excluir usuários.");
        }
    };

    const handleEdit = (user: User) => {
        setEditUser({ ...user });
    };

    const handleCancelEdit = () => {
        setEditUser(null);
    };

    const handleUpdate = async (id: number, updatedUser: User) => {
        const updatedFields = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
        };
        await updateUser(id, updatedFields);
        setEditUser(null);
        fetchUsers();
    } 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editUser && userType === UserType.Common) {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }
    };

    return (
    <div>
      <h2>User List</h2>
      <Table bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>User Type</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {editUser && editUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={editUser.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  user.firstName
                )}
              </td>
              <td>
                {editUser && editUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={editUser.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  user.lastName
                )}
              </td>
              <td>
                {editUser && editUser.id === user.id ? (
                  <Form.Control
                    type="text"
                    name="email"
                    value={editUser.email}
                    onChange={handleChange}
                  />
                ) : (
                  user.email
                )}
              </td>
              {user.userType === UserType.Admin && (
                <td>{userTypeToString(user.userType)}</td>
              )}
              <td>
                <Button variant="info" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                {user.userType === UserType.Admin && (
                  <Button variant="danger" onClick={() => handleDelete(user.id)}>
                    Delete
                  </Button>
                )}
                {editUser && editUser.id === user.id && (
                  <>
                    <Button variant="success" onClick={() => handleUpdate(user.id, editUser)}>
                      Update
                    </Button>
                    <Button variant="danger" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    );
};

export default UserPortal;
