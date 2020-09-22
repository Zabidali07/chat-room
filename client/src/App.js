import React from "react";
import axios from "axios";
import { signout } from "./utils/helper";
import Routes from "./routes/Routes";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("CC_Token");
  config.headers.Authorization = token;

  return config;
});
axios.interceptors.response.use(null, (error) => {
  if (error.response.status === 401) {
    signout(() => {
      window.location.href = "/";
    });
  }

  return Promise.reject(error);
});
function App() {
  return (
    <div>
      <Routes />
    </div>
  );
}

export default App;
