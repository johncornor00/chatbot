import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../config/authSlice";
import "../styles/Login.scss";
import { RootState, AppDispatch } from "../app/store";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/dashboard");
      dispatch(reset());
    }
  }, [isSuccess, user, navigate, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    dispatch(LoginUser({ email, password }));
  };

  return (
    <div className="container">
      <div className="drop">
        <div className="content">
          <h2>Sign in</h2>
          {isError && <p className="error">{message}</p>}
          <form onSubmit={handleAuth}>
            <div className="inputBox">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="inputBox">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="inputBox">
              <input type="submit" value={isLoading ? "Loading..." : "Login"} disabled={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
