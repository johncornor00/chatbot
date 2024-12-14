import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/FormEditUser.scss";

const FormEditUser: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [role, setRole] = useState<"admin" | "user" | "manager">("user");
  const [msg, setMsg] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const getUserById = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMsg("Authentication token is missing.");
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.role as "admin" | "user" | "manager");
      } catch (error: any) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getUserById();
  }, [id]);

  const updateUser = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMsg("Authentication token is missing.");
        return;
      }

      await axios.patch(
        `${process.env.REACT_APP_BACKEND}/users/${id}`,
        {
          name: name,
          email: email,
          password: password,
          confPassword: confPassword,
          role: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/users");
    } catch (error: any) {
      if (error.response) {
        setMsg(error.response.data.msg);
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
    <div className="form-edit-user">
      <h1 className="form-edit-user__title">Users</h1>
      <h2 className="form-edit-user__subtitle">Update User</h2>
      <div className="form-edit-user__card">
        <div className="form-edit-user__card-content">
          <div className="form-edit-user__content">
            <form onSubmit={updateUser}>
              <p className="form-edit-user__message">{msg}</p>
              <div className="form-edit-user__field">
                <label className="form-edit-user__field-label">Name</label>
                <div className="form-edit-user__field-control">
                  <input
                    type="text"
                    className="form-edit-user__input"
                    value={name}
                    onChange={handleInputChange(setName)}
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="form-edit-user__field">
                <label className="form-edit-user__field-label">Email</label>
                <div className="form-edit-user__field-control">
                  <input
                    type="text"
                    className="form-edit-user__input"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    placeholder="Email"
                  />
                </div>
              </div>
              <div className="form-edit-user__field">
                <label className="form-edit-user__field-label">Password</label>
                <div className="form-edit-user__field-control">
                  <input
                    type="password"
                    className="form-edit-user__input"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="form-edit-user__field">
                <label className="form-edit-user__field-label">Confirm Password</label>
                <div className="form-edit-user__field-control">
                  <input
                    type="password"
                    className="form-edit-user__input"
                    value={confPassword}
                    onChange={handleInputChange(setConfPassword)}
                    placeholder="******"
                  />
                </div>
              </div>
              <div className="form-edit-user__field">
                <label className="form-edit-user__field-label">Role</label>
                <div className="form-edit-user__field-control">
                  <select
                    className="form-edit-user__select"
                    value={role}
                    onChange={handleRoleChange}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
              </div>
              <div className="form-edit-user__field">
                <div className="form-edit-user__field-control">
                  <button type="submit" className="form-edit-user__button">
                    Update
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

export default FormEditUser;
