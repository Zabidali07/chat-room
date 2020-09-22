import React, { useState } from "react";
import axios from "axios";
import { useHistory, withRouter } from "react-router-dom";
import makeToast from "../Toaster/Toaster";
import { authenticate, isAuth } from "../utils/helper";
import Layout from "./Layout";

const Login = ({ setupSocket }) => {
  const history = useHistory();
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    buttonText: "Login",
  });

  const { buttonText, email, password } = formInputs;

  const handleChange = (evt) => {
    setFormInputs({
      ...formInputs,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.error) {
          makeToast("error", response.data.error);
          setFormInputs({
            ...formInputs,
            email: "",
            password: "",
            buttonText: "Login",
          });
        } else {
          makeToast("success", response.data.message);
          localStorage.setItem("CC_Token", response.data.token);

          authenticate(response, () => {
            setFormInputs({
              ...formInputs,
              email: "",
              password: "",
              buttonText: "Login",
            });
          });

          if (isAuth()) {
            history.push("/friends/openFriends");
            setupSocket();
          } else {
            history.push("/");
          }
        }
      })
      .catch((err) => {
        // console.log(err);
        if (err && err.response && err.response.data && err.response.data.error)
          makeToast("error", err.response.data.error);
      });
  };
  return (
    <div>
      <Layout />
      <div className="make-center">
        {" "}
        <div className="login-content">
          <form className="login-form">
            <img src="../rnm.svg" />
            <h3 className="title">Sign in to Chat-room</h3>
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
                  placeholder="Email"
                  className="login-input"
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
                  name="password"
                  type="password"
                  value={password}
                  placeholder="Password"
                  className="login-input"
                />
              </div>
            </div>

            <button
              type="button"
              className="login-btn"
              style={{ display: "inline" }}
              onClick={handleSubmit}
            >
              {" "}
              {buttonText}{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
