import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import makeToast from "../Toaster/Toaster";

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("CC_Token");
  const [clickEvent, setClickEvent] = useState(false);

  let id = localStorage.getItem("user");
  id = JSON.parse(id);

  useEffect(() => {
    axios
      .post("/chatroom/listOfRemUsers", { id })
      .then((response) => {
        console.log("Token is", localStorage.getItem("CC_Token"));
        console.log(response);
        setUsers(response.data.result);
      })
      .catch((err) => {
        console.log("Token is", localStorage.getItem("CC_Token"));
        console.log("Error in getting list of users from database", err);
      });
  }, [clickEvent]);

  const sendRequest = (acceptId) => (event) => {
    axios
      .post("/chatroom/sendFriendRequest", { userId: id, friendId: acceptId })
      .then((response) => {
        makeToast("success", response.data.message);
        setClickEvent(!clickEvent);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.error)
          makeToast("error", err.response.data.error);
      });
  };
  return (
    <div>
      <Layout />{" "}
      <div className="list-container">
        {users.length >= 1 ? (
          users.map((user) => (
            <div key={user._id} className="list-item">
              <div className="list-name">{user.name}</div>
              <button className="list-button" onClick={sendRequest(user._id)}>
                Make friend
              </button>
            </div>
          ))
        ) : (
          <h2>
            No Users are there to send request check sent request if someone
            have send you requests
          </h2>
        )}
      </div>
    </div>
  );
};

export default Allusers;
