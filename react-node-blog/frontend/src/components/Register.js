import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('')

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/register', { email, password });

            console.log(response)
            
            // Assuming your backend sends a success message
            if (response.data && response.data.message === 'User registered successfully') {
                // Redirect to the login page upon successful registration
                navigate('/login');
            }

        } catch (error) {
            console.error(error.response.data);
            // Handle errors, e.g., display an error message to the user
            if (error.response.data && error.response.data.error === 'User is already registered') {
                setStatus('User is already registered')
            }
        }

    }


    return (
        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', alignItems:'center', height:'100vh'}}>
            <form id="1" name="registerform" onSubmit={(e) => e.preventDefault()}>
                <h3>Register Page</h3>
                <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email address' style={{ padding:'10px'}} /><br></br>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' style={{ padding:'10px', marginTop:'5px'}}/><br></br>
                {status && (
                    <p style={{ color:'red'}}>{status}</p>
                )}
                <button onClick={handleRegister} style={{ padding:'5px', marginTop:'5px'}}>Register</button>
                <p>Allready have an account</p>
                <Link to='/login'>
                <p>Go to login page</p>
                </Link>
            </form>

        </div>
    );
};

export default RegisterPage;
