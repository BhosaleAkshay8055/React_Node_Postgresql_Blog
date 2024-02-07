import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import RegisterPage from "./Register";
import ShowBlogs from "./ShowBlog";
import LoginPage from "./LoginPage";
import AddBlogss from "./AddBlogss";
import AllBlogs from './AllBlog';



export default function Routing() {
    return (
        <>
            <Router>
                <Routes> 
                    
                    {/* Open Routes Start */}
                    <Route path="/" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/allblogs" element= { <AllBlogs />} />
                    {/* Open Routes End */}
                    
                    {/* Protected Routes Start */}
                    <Route path="/blogsadd" element= { <AddBlogss />} />
                    <Route path="/blogs" element={<ShowBlogs />} /> {/* in this page have delete blog functionality */}
                    {/* Protected Routes End */}

                </Routes>
            </Router>
        </>
    )
}