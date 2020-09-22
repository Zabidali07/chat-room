import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import makeToast from "../Toaster/Toaster";

const Friends = ({ socket, match }) => {
  const open = match.params.open;
  console.log(open);
  const [friendList, setFriendList] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [clickEvent, setClickEvent] = useState(false);

  let id = localStorage.getItem("user");
  id = JSON.parse(id);

  useEffect(() => {
    axios
      .post("/chatroom/getAllFriends", { id })
      .then((res) => {
        console.log(res);
        setFriendList(res.data.result.friends);
        setFriendRequests(res.data.result.friendReq);
        setSentRequests(res.data.result.sentReq);
      })
      .catch((err) => {
        if (err) {
          console.log("Error in receivig list", err);
        }
      });
  }, [clickEvent]);

  const acceptRequest = (acceptId) => (event) => {
    axios
      .post("/chatroom/acceptRequest", { userId: id, acceptId: acceptId })
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
      <Layout />
      <div className="list-container">
        {open === "openFriends" ? (
          friendList.length >= 1 ? (
            friendList.map((e) => (
              <div key={e._id} className="list-item">
                <div className="list-name"> {e.name} </div>{" "}
                <button className="list-button">
                  <Link to={"/chatroom/" + e._id}>chat</Link>
                </button>{" "}
              </div>
            ))
          ) : (
            <h2>
              None of Them are there to chat <br />
              Make friends to begin chat
            </h2>
          )
        ) : null}
      </div>
      <div className="list-container">
        {open === "openRequest" ? (
          friendRequests.length >= 1 ? (
            friendRequests.map((e) => (
              <div key={e._id} className="list-item">
                <div className="list-name"> {e.name} </div>
                <button className="list-button" onClick={acceptRequest(e._id)}>
                  Accept Request
                </button>
              </div>
            ))
          ) : (
            <h2>
              No Request from Friends. <br />
              No Woories, You start making friends.
            </h2>
          )
        ) : null}
      </div>
      <div className="list-container">
        {open === "openSentRequest" ? (
          sentRequests.length >= 1 ? (
            sentRequests.map((e) => (
              <div key={e._id} className="list-item">
                {" "}
                <div className="list-name"> {e.name} </div>{" "}
                <button className="list-button">Request sent</button>{" "}
              </div>
            ))
          ) : (
            <h2>
              {" "}
              Friends have accepted your requests <br />
              send Request to new users
            </h2>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Friends;
