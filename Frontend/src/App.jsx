import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'

import Addmenu from './Pages/AddMenu/Addmenu'
import Menulists from './Pages/Menulists/Menulists'
import Orders from './Pages/Orders/Orders'

const App = () => {
  return (
    <div>
      <Navbar /> 
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/addmenu" element={<Addmenu />} />
          <Route path="/menulists" element={<Menulists />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  )
}

export default App