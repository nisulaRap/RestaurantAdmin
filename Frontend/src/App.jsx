import React, { useContext, useState } from 'react';
import { AuthContext } from './Components/Context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Sidebar from './Components/Sidebar/Sidebar';

import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import Addmenu from './Pages/AddMenu/Addmenu';
import Menulists from './Pages/Menulists/Menulists';
import Orders from './Pages/Orders/Orders';
import UpdateMenu from './Pages/UpdateMenu/UpdateMenu';
import AddRestaurant from './Pages/AddRestaurant/AddRestaurant';
import Restaurantlists from './Pages/Restaurantlists/Restaurantlists';
import UpdateRestaurant from './Pages/UpdateRestaurant/UpdateRestaurant';

const App = () => {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <div className="app-body">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

            {/* Core Admin Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/addmenu" element={<Addmenu />} />
            <Route path="/update/:id" element={<UpdateMenu />} />
            <Route path="/menulists" element={<Menulists />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/addrestaurant" element={<AddRestaurant />} />
            <Route path="/restaurantlists" element={<Restaurantlists />} />
            <Route path="/updaterestaurant/:id" element={<UpdateRestaurant />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
