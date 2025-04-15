import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { useState } from 'react';
import { AuthContext } from '../../Components/Context/AuthContext'
import { jwtDecode } from 'jwt-decode';
import './Login.css'

function Login() {

    const { login } = useContext(AuthContext);

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const loginForm = async (e) => {

        e.preventDefault();

        const response = await axios.post(`http://localhost:7001/api/users/login`, { name, password },
            { withCredentials: true }
        );

        const token = response.data.token;

        login(token);
        console.log(token); //debugging 

        const decode = jwtDecode(token);
        console.log(decode); //debugging

        if (decode.role === 'SystemAdmin') {
            navigate('/SystemAdmin')
        } else if (decode.role === 'ResturantAdmin') {
            navigate('/')

        } else if (decode.role === 'DeliveryPerson') {
            navigate('/DeliveryPerson')
        } else if (decode.role === 'Customer') {
            navigate('/Customer');
        }
    }

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-box">
                    <h2>Welcome Back</h2>
                    <p>Please login to your account</p>
                    <form onSubmit={loginForm}>
                        <input type="text" placeholder="Name" value={name}
                                    onChange={(e) => setName(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password}
                                    onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Login</button>
                    </form>
                    {/*<div className="login-footer">
                        <p>Don't have an account? <a href="#">Sign up</a></p>
                    </div>*/}
                </div>
            </div>
        </div>
        
    )
}

export default Login
