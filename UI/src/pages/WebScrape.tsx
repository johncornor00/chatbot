import React, { useEffect } from 'react';
import Layout from './Layout';
import TextInputForm from '../components/Editor';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../config/authSlice";
import { RootState, AppDispatch } from "../app/store";

//import axios from 'axios';

const WebScrape: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isError } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);



  return (
    <Layout>
      <div>
        <TextInputForm/>
      </div>
    </Layout>
  );
};

export default WebScrape;
