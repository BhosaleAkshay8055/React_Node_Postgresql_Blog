import React, { useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage({ setToken }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });

            if (response.data && response.data.token) {
                const token = response.data.token;

                // Calculate token expiration time (1 minute from now)
                const expirationTime = Date.now() + 60000;
                
                // Store token and expiration time in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('expirationTime', expirationTime);
                
                navigate('/blogsadd');
            } else {
                console.log('Login failed: No token found in response');
                // Handle login failure, maybe show an error message to the user
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure, maybe show an error message to the user
        }
    }, [email, password, navigate]);

    return (
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center', height:'100vh'}}>
            <form id="2" name="loginform" onSubmit={(e) => e.preventDefault()}>
                <h3>Login Page</h3>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email address' style={{ padding:'10px'}} /><br></br>
                <input type="password" id="password" name="password" value={password} autoComplete='false' onChange={(e) => setPassword(e.target.value)} placeholder='password' style={{ padding:'10px', marginTop:'5px'}}/><br></br>
                <button onClick={handleLogin} style={{ padding:'5px', marginTop:'5px'}}>Login</button>
                <p>Not have an account</p>
                <Link to='/'>
                    <p>Go to register page</p>
                </Link>
            </form>
        </div>
    );
}
