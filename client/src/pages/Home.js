import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="nav">
            <Link className="nav_link" to="/">
                Home
            </Link>
            <Link className="nav_link" to="/login">
                Login
            </Link>
            <Link className="nav_link" to="/register">
                Register
            </Link>
        </nav>
    );
};

export default Navbar;