import {Route, Routes } from 'react-router-dom';
import Login from './pages';
import UserPortal from './components/UserPortal'; 
import './App.css'

const App = () => {
  return (
    <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/user-portal" element={<UserPortal/>} />
    </Routes>
  );
};

export default App;
