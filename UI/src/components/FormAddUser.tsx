import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/FormAddUser.scss";

const FormAddUser: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [role, setRole] = useState<"admin" | "user" | "manager">("user");
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();

  const saveUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Authentication token is missing.");
        return;
      }

      await axios.post(
        `${process.env.REACT_APP_BACKEND}/users`,
        {
          name,
          email,
          password,
          confPassword,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/users");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setMsg(error.response.data.detail);
      } else {
        setMsg("An error occurred. Please try again.");
      }
    }
  };

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "admin" | "user" | "manager";
    setRole(value);
  };

  return (
    <div className="form-add-user">
      <h1 className="form-add-user__title">Users</h1>
      <h2 className="form-add-user__subtitle">Add New User</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={saveUser}>
              <p className="form-add-user__error">{msg}</p>
              <div className="form-add-user__field">
                <label className="form-add-user__field-label">Name</label>
                <div className="form-add-user__field-control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={handleInputChange(setName)}
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="form-add-user__field">
                <label className="form-add-user__field-label">Email</label>
                <div className="form-add-user__field-control">
                  <input
                    type="text"
                    className="input"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="form-add-user__field">
                <label className="form-add-user__field-label">Password</label>
                <div className="form-add-user__field-control">
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="form-add-user__field">
                <label className="form-add-user__field-label">Confirm Password</label>
                <div className="form-add-user__field-control">
                  <input
                    type="password"
                    className="input"
                    value={confPassword}
                    onChange={handleInputChange(setConfPassword)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="form-add-user__field">
                <label className="form-add-user__field-label">Role</label>
                <div className="form-add-user__field-control">
                  <div className="select">
                    <select value={role} onChange={handleRoleChange}>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="form-add-user__field">
                <div className="form-add-user__field-control">
                  <button type="submit" className="form-add-user__button">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddUser;
