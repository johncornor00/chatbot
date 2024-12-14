import React, { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { rehydrate, getMe } from "../config/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!user && localStorage.getItem("user")) {
      dispatch(rehydrate()).then(() => {
        dispatch(getMe());
      });
    }
  }, [user, dispatch]);  

  return user ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
