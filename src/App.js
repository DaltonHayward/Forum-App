//DRH846
//11280305
//CMPT 353

import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { RegisterUser } from './pages/RegisterUser';
import { HomePage } from './pages/HomePage';
import { CreateServer } from './pages/CreateServer' 
import { UserContext } from './UserContext';
import { Server } from './pages/Server';


function App() { 
  const { user } = useContext(UserContext); 

  return (
    <Routes>
      <Route path="*" element ={user == null ? <Navigate replace to={"/"} /> : <Navigate replace to={"/home"} />} />
      <Route path="/" element={user == null ? <LoginPage /> : <Navigate replace to={"/home"} />} />
      <Route path="/registration" element={user == null ? <RegisterUser /> : <Navigate replace to={"/home"} />} />
      <Route path='/home' element={user != null ? <HomePage /> : <Navigate replace to={"/"} />} />
      <Route path='/server'>
        <Route index element={user != null ? <CreateServer /> : <Navigate replace to={"/"} />}/>
        <Route path=":serverID/:serverName" element={user != null ? <Server /> : <Navigate replace to={"/"} />} />
      </Route>
    </Routes>
  );
}

export default App;
