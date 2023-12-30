import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Alert, Modal} from 'react-bootstrap';
import { getUserList, addUser, deleteUser, updateUser } from '../../services/user.service';

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
    const [showEditAlert, setEditShowAlert] = useState(false);
    const [showCreateAlert, setCreateShowAlert] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteAlert, setDeleteShowAlert] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: UserType.Common,
    });
    const [editingUserId, setEditingUserId] = useState<number | null>(null);

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
        setDeleteShowAlert(true);
        setTimeout(() => {
            setDeleteShowAlert(false);
        }, 3000);
    };

    const handleEdit = (user: User) => {
        setEditUser({ ...user });
        setEditingUserId(user.id);
    };

    const handleCancelEdit = () => {
        setEditUser(null);
        setEditingUserId(null);
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
            setEditShowAlert(true);
            setTimeout(() => {
            setEditShowAlert(false);
            }, 3000);
            setEditUser(null);
            setEditingUserId(null);
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

    const handleCreateUser = async () => {
        try {
          await addUser(newUser);
          setCreateShowAlert(true);
          setTimeout(() => {
            setCreateShowAlert(false);
          }, 5000);
          setShowCreateModal(false);
          setNewUser({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            userType: UserType.Common,
          });
          fetchUsers();
        } catch (error) {
          console.error('Erro ao criar usuário:', error);
        }
    };
    
    return (
    <div>
      <h2>User Portal</h2>
      {showEditAlert && (
        <Alert variant="success" onClose={() => setEditShowAlert(false)} dismissible>
          Usuário editado com sucesso!
        </Alert>
      )}
      {showCreateAlert && (
        <Alert variant="success" onClose={() => setCreateShowAlert(false)} dismissible>
          Usuário criado com sucesso!
        </Alert>
      )}
      {showDeleteAlert && (
        <Alert variant="success" onClose={() => setDeleteShowAlert(false)} dismissible>
          Usuário removido com sucesso!
        </Alert>
      )}
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Create User
      </Button>
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                as="select"
                value={newUser.userType}
                onChange={(e) => setNewUser({ ...newUser, userType: Number(e.target.value) })}
              >
                <option value={UserType.Admin}>{userTypeToString(UserType.Admin)}</option>
                <option value={UserType.Common}>{userTypeToString(UserType.Common)}</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create User
          </Button>
        </Modal.Footer>
      </Modal>
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
                    {editingUserId === user.id ? (
                        <Form.Control
                        type="text"
                        name="firstName"
                        value={editUser?.firstName}
                        onChange={handleChange}
                        />
                    ) : (
                        user.firstName
                    )}
                    </td>
                    <td>
                        {editingUserId === user.id ? (
                        <Form.Control
                            type="text"
                            name="lastName"
                            value={editUser?.lastName}
                            onChange={handleChange}
                        />
                        ) : (
                        user.lastName
                        )}
                    </td>
                    <td>
                        {editingUserId === user.id ? (
                        <Form.Control
                            type="text"
                            name="email"
                            value={editUser?.email}
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
                        {editingUserId === user.id ? (
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
