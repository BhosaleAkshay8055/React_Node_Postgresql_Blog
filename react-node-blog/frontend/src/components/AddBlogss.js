import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function AddBlogss() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);

    console.log('blogs: ', blogs)


    useEffect(() => {
        // Function to check if the token has expired
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            const expirationTime = localStorage.getItem('expirationTime');
            if (!token || !expirationTime || parseInt(expirationTime) < Date.now()) {
                // If token does not exist or has expired, redirect to login page
                navigate('/login');
            }
        };

        // Run the checkTokenExpiration function initially when the component mounts
        checkTokenExpiration();

        // Run the checkTokenExpiration function every second to continuously monitor the token expiration
        const interval = setInterval(checkTokenExpiration, 1000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(interval);
    }, [navigate]
    ); // Dependency array including navigate to ensure effect runs when navigate changes


    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        // If the input is of type 'file', update the 'image' state
        if (name === 'image' && files.length > 0) {
            setNewBlog({ ...newBlog, image: files[0] });

            // Display a preview of the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } else {
            // For other inputs, update the state as usual
            setNewBlog({ ...newBlog, [name]: value });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle the image file
        const formData = new FormData();
        formData.append('title', newBlog.title);
        formData.append('content', newBlog.content);
        formData.append('image', newBlog.image);

        try {
            // Send a POST request to create a new blog
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/blogsadd', formData, { headers: { Authorization: token } });

            setBlogs([...blogs, response.data]);
            setNewBlog({ title: '', content: '', image: null });
            setImagePreview(null);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     // Do something with token if needed
    // }, [token]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Add New Blog</h1>
            <form onSubmit={handleSubmit}>
                <label className='blog-form-feilds'>
                    Title:
                    <input type="text" name="title" value={newBlog.title} onChange={handleInputChange} />
                </label>
                <br />
                <br />
                <br />
                <label className='blog-form-feilds'>
                    Content:
                    <textarea name="content" value={newBlog.content} onChange={handleInputChange}></textarea>
                </label>
                <br />
                <br />
                <br />
                <label className='blog-form-feilds'>
                    Image:
                    <input type="file" name="image" onChange={handleInputChange} />
                </label>
                <br />
                <br />
                {imagePreview && (
                    <img src={imagePreview} alt="Image Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                )}
                <br />
                <button type="submit">Add Blog</button>
                <Link to='/blogs'>
                    <span>View Blogs</span>
                </Link>
            </form>
        </div>
    );
}

export default AddBlogss;
