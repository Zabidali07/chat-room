import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import makeToast from "../Toaster/Toaster";
import Layout from "./Layout";

const Signup = () => {
  const history = useHistory();
  const [formInputs, setFormInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    buttonText: "SignUp",
  });

  const { buttonText, name, email, password, confirmPassword } = formInputs;

  const handleChange = (evt) => {
    setFormInputs({
      ...formInputs,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = (evt) => {
    // Avoid page refresh
    evt.preventDefault();
    if (password !== confirmPassword) {
      makeToast("error", "password mismatch");
      setFormInputs({
        ...formInputs,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        buttonText: "SignUp",
      });
    } else {
      axios
        .post("/signup", {
          name,
          email,
          password,
        })
        .then((response) => {
          if (response.data.error) {
            makeToast("error", response.data.error);
            setFormInputs({
              ...formInputs,
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              buttonText: "SignUp",
            });
          } else {
            makeToast("success", response.data.message);
            history.push("/login");
          }
        })
        .catch((err) => {
          // console.log(err);
          if (
            err &&
            err.response &&
            err.response.data &&
            err.response.data.error
          )
            makeToast("error", err.response.data.error);
        });
    }
  };

  return (
    <div>
      <Layout />
      <div className="make-center">
        <div className="login-content">
          <form className="login-form">
            <img src="../sinupchat.svg" />
            <h3 className="title">Sign up Here</h3>
            <div className="login-input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  type="text"
                  className="login-input"
                  onChange={handleChange}
                  name="name"
                  placeholder="Name"
                  value={name}
                />
              </div>
            </div>
            <div className="login-input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  onChange={handleChange}
                  name="email"
                  type="email"
                  value={email}
                  className="login-input"
                  placeholder="Email"
                />
              </div>
            </div>
            <div className="login-input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input
                  onChange={handleChange}
                  name="password"
                  type="password"
                  value={password}
                  className="login-input"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="login-input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input
                  onChange={handleChange}
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  className="login-input"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            <button
              type="button"
              className="login-btn"
              style={{ display: "inline" }}
              value="Signup"
              onClick={handleSubmit}
            >
              {" "}
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
