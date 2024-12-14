
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Userlist.scss";


interface User {
  uuid: string;
  name: string;
  email: string;
  role: string;
}

const Userlist: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<User[]>(`${process.env.REACT_APP_BACKEND}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_BACKEND}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      className="userlist-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1 className="title">List Of Users</h1>
      <Link to="/users/add" className="add-user-button">
        Add New
      </Link>
      <motion.table
        className="user-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <motion.tr
              key={user.uuid}
              whileHover={{ scale: 1.02, backgroundColor: "#f5f5f5" }}
              transition={{ duration: 0.3 }}
            >
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Link to={`/users/edit/${user.uuid}`} className="edit-button">
                  Edit
                </Link>
                <button
                  onClick={() => deleteUser(user.uuid)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </motion.table>
    </motion.div>
  );
};

export default Userlist;
