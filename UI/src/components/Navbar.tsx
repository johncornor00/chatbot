import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoPerson, IoPricetag, IoHome, IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../config/authSlice";
import "../styles/navbar.scss";
import { assets } from "../assets/assets"; 
import { AppDispatch } from "../app/store";


interface User {
  role: "admin" | "user" | "manager";
}

interface AuthState {
  user: User | null;
}

interface RootState {
  auth: AuthState;
}

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const logout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="custom-navbar">
      <div className="logo">
        <img src={assets.gemini_icon} alt="Chat Logo" className="logo-image" />
      </div>
      <div className="menu">
        <NavLink to="/dashboard" className="navbar-item">
          <IoHome />
          <span className="label">Dashboard</span>
        </NavLink>
        {user && (user.role === "admin" || user.role === "manager") && (
          <NavLink to="/webscrape" className="navbar-item">
            <IoPricetag />
            <span className="label">Our Services</span>
          </NavLink>
        )}
        {user && (user.role === "admin" || user.role === "user") && (
          <NavLink to="/chatApp" className="navbar-item">
            <IoPricetag />
            <span className="label">ChatApp</span>
          </NavLink>
        )}
        {user && user.role === "admin" && (
          <NavLink to="/users" className="navbar-item">
            <IoPerson />
            <span className="label">Users</span>
          </NavLink>
        )}
        <NavLink to="/" onClick={logout} className="navbar-item">
          <IoLogOut />
          <span className="label">Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
