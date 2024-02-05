import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';


export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log('login page')

    const handleLogin = async () => {
        console.log('start login request')
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });

            console.log('loginresponse: ', response);
            console.log('login response data: ', response.data);
            console.log('login response status: ', response.status);
            
            if (response.headers['content-type'] === 'text/html') {
                console.log('Received HTML response. Check server-side code.');
                // Handle the HTML response accordingly
            } else {
                console.log('Received JSON response:', response.data);
                // Handle the JSON response as expected
            }

            // Assuming your backend sends a success message and a token
            if (response.data && response.data.message === 'Login successful') {
                // Store the token in local storage (you should use a more secure storage method)
                // localStorage.setItem('token', response.data.token);
                console.log('Redirecting to /blog');
                // Redirect to the blog page upon successful login
                navigate('/blogsadd');
            }

        } catch (error) {
            console.error(error);
            // Handle errors, e.g., display an error message to the user
        }
    }

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