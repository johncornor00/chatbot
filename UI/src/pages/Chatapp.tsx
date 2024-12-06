import Main from '../components/Main';
import Sidebar from '../components/Sidebar';
import '../styles/chatapp.scss';
import React from 'react';

const Chatapp = () => {
  return (
    <div className="chat-app">
      <Sidebar />
      <Main />
    </div>
  );
};

export default Chatapp;
