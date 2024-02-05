import React from "react";

import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import RegisterPage from "./Register";
import ShowBlogs from "./ShowBlog";
import LoginPage from "./LoginPage";
import AddBlogss from "./AddBlogss";



export default function Routing() {


    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<RegisterPage />} />
                    <Route path="/blogs" element={<ShowBlogs />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/blogsadd" element={<AddBlogss />} />
                </Routes>
            </Router>
        </>
    )
}