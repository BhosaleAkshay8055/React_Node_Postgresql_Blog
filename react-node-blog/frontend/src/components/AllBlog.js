import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { Link, useNavigate } from 'react-router-dom';

function AllBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  
  useEffect(() => {
    let isMounted = true;

    const fetchAndDisplayImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allblogs');
        const blogsData = response.data;

        // Cleanup previous object URLs
        imageUrls.forEach(URL.revokeObjectURL);

        const newBlogs = await Promise.all(blogsData.map(async (blog) => {
          if (blog.image && typeof blog.image === 'object') {
            try {
              const imageResponse = await fetch(`data:image/png;base64,${Buffer.from(blog.image).toString('base64')}`);
              const imageData = await imageResponse.blob();
              const imageUrl = URL.createObjectURL(imageData);
              return { ...blog, imageUrl };
            } catch (error) {
              console.error('Error fetching and displaying image:', error);
              return blog;
            }
          }
          return blog;
        }));

        if (isMounted) {
          // Update the state with new object URLs
          setBlogs(newBlogs);
          setImageUrls(newBlogs.map(blog => blog.imageUrl).filter(url => url));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAndDisplayImages();

    // Cleanup function to revoke object URLs when the component unmounts
    return () => {
      isMounted = false;
      imageUrls.forEach(URL.revokeObjectURL);
    };
  }, []);

  const gotoRegisterPage = () => {
    navigate('/register')
  }

  return (
    <div className="container">
      <h2 className="text-center">All Blogs</h2>
      <button className="buttonAdminPanel" onClick={ gotoRegisterPage }>Admin Panel</button>
      <div className="row">
        {blogs.map((blog, index) => (
          <div key={index + 1} className="col-lg-4 col-md-6 mb-3 d-flex">
            <div className="border p-3 flex-column position-relative" style={{ height: '100%' }}>
              <h3>{blog.title}</h3>
              {/* Display the image if available */}
              {blog.imageUrl && (
                <React.Fragment>
                  <div className="d-flex justify-content-center mb-3">
                    <img
                      src={blog.imageUrl}
                      alt={`Image for ${blog.title}`}
                      className="img-fluid mx-auto mb-3"
                      style={{ maxHeight: '150px', objectFit: 'cover' }}
                    />
                  </div>
                </React.Fragment>
              )}
              <p className="w-auto flex-grow-1">{blog.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllBlogs;
