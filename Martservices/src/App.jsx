import { useState } from 'react'
// import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Components/RegistrationForm';
import Nav from './Components/Navbar'
import Login from './Components/Login';
import Loginseller from './Components/sellerlogin';
import Product from './Components/Productpage';
import UserLogin from './Components/UserLogin';
import UserRegistration from './Components/UserRegistration';
import Dashboard from './Components/dashboard';
import Addtocard from './Components/Addtocart';

function App() {
  

  return (
    <Router>
    {/* <Nav/> */}
    <Routes>
      <Route path='/loginseller' element={<Loginseller/>}/>
      <Route path='/' element={<Nav/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/product/:id' element={<Product/>}/>
      <Route path='/UserLogin' element={<UserLogin/>}/>
      <Route path='/Registration' element={<UserRegistration/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/Addcard' element={<Addtocard/>}/>
    </Routes>
    </Router>
    
    
  )
}

export default App
