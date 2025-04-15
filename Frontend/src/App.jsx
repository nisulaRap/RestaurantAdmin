import React from 'react'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Sidebar from './Components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Dashboard from './Pages/Dashboard/Dashboard'
import Addmenu from './Pages/AddMenu/Addmenu'
import Menulists from './Pages/Menulists/Menulists'
import Orders from './Pages/Orders/Orders'
import UpdateMenu from './Pages/UpdateMenu/UpdateMenu'
import AddRestaurant from './Pages/AddRestaurant/AddRestaurant';
import Restaurantlists from './Pages/Restaurantlists/Restaurantlists';
import UpdateRestaurant from './Pages/UpdateRestaurant/UpdateRestaurant';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Header /> 
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/addmenu" element={<Addmenu />} />
          <Route path="/update/:id" element={<UpdateMenu />} />
          <Route path="/menulists" element={<Menulists />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/addrestaurant" element={<AddRestaurant />} />
          <Route path="/restaurantlists" element={<Restaurantlists />} />
          <Route path="/updaterestaurant/:id" element={<UpdateRestaurant />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App