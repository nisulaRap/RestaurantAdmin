import React, { useContext } from 'react'
import { AuthContext } from './Components/Context/AuthContext'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Sidebar from './Components/Sidebar/Sidebar'

import Login from './Pages/Login/Login'
import Dashboard from './Pages/Dashboard/Dashboard'
import Addmenu from './Pages/AddMenu/Addmenu'
import Menulists from './Pages/Menulists/Menulists'
import Orders from './Pages/Orders/Orders'
import UpdateMenu from './Pages/UpdateMenu/UpdateMenu'
import AddRestaurant from './Pages/AddRestaurant/AddRestaurant'
import Restaurantlists from './Pages/Restaurantlists/Restaurantlists'
import UpdateRestaurant from './Pages/UpdateRestaurant/UpdateRestaurant'

/*const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" />
  return children
}

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  if (!user || user.role !== 'RestaurantAdmin') return <Navigate to="/login" />
  return children
}*/

const App = () => {
  const { user } = useContext(AuthContext)

  return (
    <>
      <ToastContainer />
      <Header />
      <hr />
      <div className="app-content">
        {user && <Sidebar />}
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

          {/* Protected Dashboard - visible to all logged-in users */}
          {/*<Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />*/}

          {/* Admin-only Routes */}
          {/*<Route path="/" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/addmenu" element={<AdminRoute><Addmenu /></AdminRoute>} />
          <Route path="/update/:id" element={<AdminRoute><UpdateMenu /></AdminRoute>} />
          <Route path="/menulists" element={<AdminRoute><Menulists /></AdminRoute>} />
          <Route path="/orders" element={<AdminRoute><Orders /></AdminRoute>} />
          <Route path="/addrestaurant" element={<AdminRoute><AddRestaurant /></AdminRoute>} />
          <Route path="/restaurantlists" element={<AdminRoute><Restaurantlists /></AdminRoute>} />
          <Route path="/updaterestaurant/:id" element={<AdminRoute><UpdateRestaurant /></AdminRoute>} />*/}

          {/* Fallback for unknown routes */}
          {/*<Route path="*" element={<Navigate to="/" />} />*/}
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
    </>
  )
}

export default App
