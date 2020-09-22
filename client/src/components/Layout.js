import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { isAuth, signout } from "../utils/helper";

const Layout = () => {
  const location = useLocation();
  const isActive = (path) => {
    if (location.pathname === path) {
      return { color: "#77f569" };
    } else {
      return { color: "#f0f7e9" };
    }
  };

  return (
    <div className="navbar">
      {isAuth() && (
        <div>
          {" "}
          <div>
            {" "}
            <a href="/allusers" style={isActive("/allusers")}>
              All user
            </a>
            <a
              href="/friends/openFriends"
              style={isActive("/friends/openFriends")}
            >
              Friends
            </a>
            <a
              href="/friends/openRequest"
              style={isActive("/friends/openRequest")}
            >
              Friend request
            </a>
            <a
              href="/friends/openSentRequest"
              style={isActive("/friends/openSentRequest")}
            >
              Sent request
            </a>
          </div>{" "}
          <div style={{ float: "right" }}>
            {" "}
            <a href="/" onClick={() => signout()}>
              Sign Out
            </a>
          </div>{" "}
        </div>
      )}

      {!isAuth() && (
        <a href="/signup" style={isActive("/signup")}>
          Signup
        </a>
      )}

      {!isAuth() && (
        <a href="/login" style={isActive("/login")}>
          Login
        </a>
      )}
    </div>
  );
};

export default Layout;
