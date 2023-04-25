import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Activate from "../pages/Activate";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";

const Index = () => {
    return (
        <BrowserRouter>
            <ToastContainer />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<Activate />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
};

export default Index;