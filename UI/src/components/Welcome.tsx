import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const Welcome: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1 className="title">Dashboard</h1>
      <h2 className="subtitle">
        Welcome Back <strong>{user && user.name}</strong>
      </h2>
    </div>
  );
};

export default Welcome;
