
import React, { useContext, useState, useRef, useEffect } from "react";
import { IoLogOut, IoHome } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import "../styles/Main.scss";
import { assets } from ".././assets/assets";
import { Context } from ".././context/Context";
import { LogOut, reset, getMe } from "../config/authSlice";
import { AppDispatch } from "../app/store";

interface User {
  name: string;
}

interface AuthState {
  user: User | null;
  isError: boolean;
}

interface RootState {
  auth: AuthState;
}

const Main = () => {
  const context = useContext(Context);
  const user = useSelector((state: RootState) => state.auth.user);
  const { isError } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user details when component mounts
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    // Redirect to login if there is an error
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const logout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  if (!context) {
    return null;
  }

  const { onSent, showResult, loading, chatHistory, setInput, input } = context;

  return (
    <div className="main">
      <div className="nav">
        <img className="ida-logo" src={assets.youtube_icon} alt="IDA" />
        <div className="unique-dropdown" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="unique-dropdown-toggle">
            {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
          </button>
          {isDropdownOpen && (
            <div className="unique-dropdown-menu">
              <div className="unique-dropdown-item">
                <span>Hello, {user && user.name}.</span>
              </div>
              <NavLink
                to="/dashboard"
                className="unique-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                <IoHome />
                <span className="label">Home</span>
              </NavLink>
              <div
                onClick={logout}
                className="unique-dropdown-item unique-logout"
              >
                <IoLogOut />
                <span className="label">Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="main-container">
        {showResult ? (
          <div className="result">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.role === "user" ? "user" : "assistant"
                }`}
              >
                <img
                  src={
                    message.role === "user"
                      ? assets.user_icon
                      : assets.gemini_icon
                  }
                  alt=""
                />
                <p>{message.content || "No content"}</p>
              </div>
            ))}
            {loading && (
              <div className="loader">
                <hr className="animated-bg" />
                <hr className="animated-bg" />
                <hr className="animated-bg" />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="greet">
              <p>
                <span>Hello, {user && user.name}.</span>
              </p>
              <p>How can I help you?</p>
            </div>
            <div className="cards">{/* Add cards content here if needed */}</div>
          </>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} width={30} alt="" />
              <img src={assets.mic_icon} width={30} alt="" />
              {input ? (
                <img
                  onClick={() => onSent()}
                  src={assets.send_icon}
                  width={30}
                  alt=""
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Bot may display inaccurate info, including about people, so
            double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;


