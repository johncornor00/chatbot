import React, { useEffect } from "react";
import Layout from "./Layout";
import FormAddUser from "../components/FormAddUser";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../config/authSlice";
import { RootState } from "../app/store"; 

const AddUser: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isError, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getMe() as any); 
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  return (
    <Layout>
      <FormAddUser />
    </Layout>
  );
};

export default AddUser;
