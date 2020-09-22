import React, { useState } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Chatroompage from "../components/Chatroompage";

import Login from "../components/Login";
import Signup from "../components/Signup";
import Home from "../components/Home";
import io from "socket.io-client";
import makeToast from "../Toaster/Toaster";
import Friends from "../components/Friends";

import Allusers from "../components/Allusers";

const Routes = () => {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = localStorage.getItem("CC_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: localStorage.getItem("CC_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route
          path="/friends/:open"
          exact
          component={Friends}
          socket={socket}
        />
        <Route path="/allusers" exact component={Allusers} socket={socket} />
        <Route
          path="/login"
          exact
          render={() => <Login setupSocket={setupSocket} />}
        />
        <Route path="/signup" exact component={Signup} />

        <Route
          path="/chatroom/:id"
          exact
          render={() => <Chatroompage socket={socket} />}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
