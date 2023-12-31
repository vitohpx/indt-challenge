import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/login.service';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { UserType, userTypeToString } from '../utils/userType';
import { addUser } from '../services/user.service';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCreateAlert, setCreateShowAlert] = useState(false);
  const [showLoginAlert, setLoginShowAlert] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: UserType.Common,
  });

  const handleLogin = async () => {
    try {
      const token = await login({ email, password });
      sessionStorage.setItem('token', token);
      navigate('/user-portal'); 
    } catch (error) {
        setLoginShowAlert(true);
        setTimeout(() => {
            setLoginShowAlert(false);
        }, 5000);
        console.error('Erro ao fazer login:', error);
    }
  };

  const handleShowRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
    setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        userType: UserType.Common,
    });
  };

  const handleRegister = async () => {
    try {
        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
            alert('Todos os campos são obrigatórios.');
            return;
        }
        await addUser(newUser);
        setNewUser({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          userType: UserType.Common,
        });
        setCreateShowAlert(true);
        setTimeout(() => {
          setCreateShowAlert(false);
        }, 5000);
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
      }
    handleCloseRegisterModal();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="mx-auto" style={{ width: '320px' }}>
            {showCreateAlert && (
                <Alert variant="success" onClose={() => setCreateShowAlert(false)} dismissible>
                    Usuário criado com sucesso!
                </Alert>
            )}
            {showLoginAlert && (
                    <Alert variant="danger" onClose={() => setLoginShowAlert(false)} dismissible>
                    Usuário inválido ou não cadastrado. Cadastre-se ou entre em contato com algum Administrador para recuperar seu acesso.
                    </Alert>
            )}  
            <h2>Login</h2>
            <Form>
                <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    required
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Form.Group>
                <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </Form.Group>
                <Button variant="primary" onClick={handleLogin}>
                Login
                </Button>
            </Form>

            <p>
                Não tem conta?{' '}
                <a href="#" onClick={handleShowRegisterModal}>
                Cadastre-se
                </a>
            </p>
            
            <Modal show={showRegisterModal} onHide={handleCloseRegisterModal}>
                <Modal.Header closeButton>
                <Modal.Title>Registre-se</Modal.Title>
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
                            required
                        />
                        </Form.Group>
                        <Form.Group controlId="formLastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                            required
                        />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            required
                        />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            required
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
                <Button variant="secondary" onClick={handleCloseRegisterModal}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleRegister}>
                    Register
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
  );
};

export default Login;
