import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AddBlogss() {
    const [blogs, setBlogs] = useState([]);
    const [newBlog, setNewBlog] = useState({ title: '', content: '', image: null });
    const [imagePreview, setImagePreview] = useState(null);

    console.log('blogs: ', blogs)

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
            const response = await axios.post('http://localhost:5000/api/blogsadd', formData);

            setBlogs([...blogs, response.data]);
            setNewBlog({ title: '', content: '', image: null });
            setImagePreview(null);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>My Blog</h1>
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
