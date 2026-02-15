import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axioInstance";
import { API_PATHS } from "../utils/apiPaths";
import { authStyles as styles } from "../assets/dummystyle";
import {Inputs} from "./Inputs"; 

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter valid email");
      return;
    }

    if (!password) {
      setError("Please enter password");
      return;
    }
    setError(' ');
    try {
      const response = await axiosInstance.post(
        API_PATHS.AUTH.LOGIN,
        { email, password }
      );

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
            Sign in to continue building amzing resumes
        </p>
      </div>
      {/* FORM */}
      <form onSubmit={handleLogin} className={styles.form}>
        <Inputs
          value={email}
          onChange={({target}) => setEmail(target.value)}
          label="Email"
          placeholder='hexawareservice@gmail.com'
          type="email"
        />

        <Inputs
          value={password}
          onChange={({target}) => setPassword(target.value)}
          label="Password"
          placeholder='min 8 character'
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>
        <p>
          Don`t have an account{' '}
          <button onClick={()=>{
            setCurrentPage('signup')
          }}
          type="submit" className={styles.switchButton}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
