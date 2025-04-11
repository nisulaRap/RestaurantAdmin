import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './Pages/Dashboard/Dashboard'
import Addmenu from './Pages/AddMenu/Addmenu'
import Menulists from './Pages/Menulists/Menulists'
import Orders from './Pages/Orders/Orders'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Navbar /> 
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addmenu" element={<Addmenu />} />
          <Route path="/menulists" element={<Menulists />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  )
}

export default App