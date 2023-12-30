import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Alert  } from 'react-bootstrap';
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
  password: string,
  userType: number;
}

const UserPortal: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

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
        // const filteredUsers = Array.isArray(userList) ? userList.filter((user: User) => user.id === 1) : [];
        setUsers(userList);
    };

    const handleDelete = async (id: number) => {
        await deleteUser(id);
        fetchUsers();
       
    };

    const handleEdit = (user: User) => {
        setEditUser({ ...user });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setEditUser(null);
        setIsEditing(false);
    };
    

    const handleUpdate = async (id: number, updatedUser: User | null) => {
        if (updatedUser) {
            const updatedFields = {
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            password: updatedUser.password,
            userType: updatedUser.userType
            };
            await updateUser(id, updatedFields);
            setShowAlert(true);
            setTimeout(() => {
            setShowAlert(false);
            }, 3000);
            setEditUser(null);
            setIsEditing(false);
            fetchUsers();
        }
    };      
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editUser) {
        setEditUser({ ...editUser, [e.target.name]: e.target.value });
        }
    };

    const handleUserTypeChange = (e: React.ChangeEvent<{ value: string }>) => {
        if (editUser) {
            setEditUser({ ...editUser, userType: Number(e.target.value) as UserType });
        }
    };    
    
    return (
    <div>
      <h2>User List</h2>
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Usuário editado com sucesso!
        </Alert>
      )}
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
                    {isEditing && editUser?.id === user.id ? (
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
                    <td>
                        {editUser && editUser.id === user.id ? (
                            <Form.Control as="select" name="userType" value={editUser?.userType} onChange={handleUserTypeChange}>
                                <option value={UserType.Admin}>{userTypeToString(UserType.Admin)}</option>
                                <option value={UserType.Common}>{userTypeToString(UserType.Common)}</option>
                            </Form.Control>
                        ) : (
                                userTypeToString(user.userType)
                            )}
                    </td>
                    <td>
                        {isEditing ? (
                        <>
                            <Button variant="success" onClick={() => handleUpdate(user.id, editUser)}>
                            Update
                            </Button>
                            <Button variant="danger" onClick={handleCancelEdit}>
                            Cancel
                            </Button>
                        </>
                        ) : (
                        <>
                            <Button variant="info" onClick={() => handleEdit(user)}>
                            Edit
                            </Button>
                            {user.userType === UserType.Admin && (
                            <Button variant="danger" onClick={() => handleDelete(user.id)}>
                                Delete
                            </Button>
                            )}
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
