import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/login.service';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { UserType } from '../utils/userType';
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

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    try {
        if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
            alert('Todos os campos são obrigatórios.');
            return;
        }

        if (!isEmailValid(newUser.email)) {
            alert('Por favor, insira um e-mail válido.');
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
        setEmail('');
        setPassword('');
      } catch (error: any) {
        alert(`Erro ao criar usuário: ${error.response.data}`);
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
                    Usuário ou senha inválidos. Entre em contato com o Administrador.
                    </Alert>
            )}  
            <img src="/indt_logo.png" alt="Logo" style={{ width: '30%', marginBottom: '20px' }} />
            <Form>
                <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label className="text-white">Email</Form.Label>
                <Form.Control
                    required
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label className="text-white">Senha</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </Form.Group>

                <Button variant="primary" onClick={handleLogin} className="mt-3">
                    Login
                </Button>
            </Form>

            <p className="text-white">
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
                            placeholder="exemplo@test.com"
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
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseRegisterModal}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleRegister}>
                    Criar
                </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </div>
  );
};

export default Login;
