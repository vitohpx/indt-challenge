import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Alert, Modal} from 'react-bootstrap';
import { getUserList, addUser, deleteUser, updateUser, getUserById } from '../../services/user.service';
import { UserType, userTypeToString } from '../../utils/userType';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaTrashAlt, FaEdit} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
    const userType = sessionStorage.getItem('userType');
    const isAdmin = userType === UserType.Admin.toString();
    const isCommon = sessionStorage.getItem('userCommon');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const userList = await getUserList();
        if (isAdmin){
            setUsers(userList);
        }
        else{
            if (isCommon) {
                const userCommon = await getUserById(parseInt(isCommon));
                setUsers([userCommon]);
            }
        }
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
            if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
                alert('Todos os campos são obrigatórios.');
                return;
            }
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

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };

    return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
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
      <h2 className="text-white">User Portal</h2>
        {isAdmin && (
            <Button variant="primary" onClick={() => setShowCreateModal(true)} className="mb-3">
                Create User
            </Button>
        )}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>Primeiro Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Primeiro Nome"
                value={newUser.firstName}
                onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Último Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Último Nome"
                value={newUser.lastName}
                onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@test.com"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control
                type="password"
                placeholder="Senha"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formUserType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                className="form-select"
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
      <Table bordered className="mb-3 table-secondary">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Senha</th>
            {isAdmin && (<th>User Type</th> )}
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
                        {isCommon && parseInt(isCommon) === user.id && editingUserId === user.id ? (
                            <div className="password-input">
                                <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={editUser?.password}
                                onChange={handleChange}
                                />
                                <Button
                                variant="outline-secondary no-hover border-0"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-button"
                                >
                                {showPassword ?  <FaEye /> : <FaEyeSlash /> }
                                </Button>
                            </div>
                            ) : (
                           <strong>**********</strong>
                        )}
                    </td>
                    {isAdmin && (
                        <td>
                            {editUser && editUser.id === user.id ? (
                                <div className="custom-dropdown-wrapper">
                                <Form.Control
                                    className="form-select"
                                    as="select"
                                    name="userType"
                                    value={editUser?.userType}
                                    onChange={handleUserTypeChange}
                                >
                                    <option value={UserType.Admin}>{userTypeToString(UserType.Admin)}</option>
                                    <option value={UserType.Common}>{userTypeToString(UserType.Common)}</option>
                                </Form.Control>
                                </div>
                            ) : (
                            userTypeToString(user.userType)
                            )}
                        </td>
                    )}
                   <td className="action-buttons">
                        {editingUserId === user.id ? (
                            <>
                            <Button variant="outline-success border-0" onClick={() => handleUpdate(user.id, editUser)}>
                                <FaCheck /> 
                            </Button>
                            <Button variant="outline-danger border-0" onClick={handleCancelEdit}>
                                <FaTimes /> 
                            </Button>
                            </>
                        ) : (
                            <>
                            <Button variant="outline-secondary border-0" onClick={() => handleEdit(user)}>
                                <FaEdit /> 
                            </Button>
                            {isAdmin && (
                                <Button variant="outline-danger border-0" onClick={() => handleDelete(user.id)} className="ml-2">
                                    <FaTrashAlt /> 
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
