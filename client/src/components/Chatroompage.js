import axios from "axios";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
import Layout from "./Layout";
import makeToast from "../Toaster/Toaster";

const Chatroompage = ({ socket, match }) => {
  const toID = match.params.id;

  const [clickSend, setClickSend] = useState(false);
  const [messages, setMessage] = useState([]);
  const [oldMsg, setOldMsg] = useState([]);
  const [userId, setUserId] = useState([]);
  const [newMessage, setnewMessage] = useState("");

  useEffect(() => {
    axios
      .post("/chatroom/getMessage", { fromID, toID })
      .then((res) => {
        // console.log(res.data.result);
        setOldMsg(res.data.result);

        let arr = [];

        res.data.result.forEach((elem) => {
          let op = {
            userId: elem.fromUser._id,
            name: elem.fromUser.name,
            message: elem.message,
          };
          arr.push(op);
        });

        console.log(arr);
        // const abc = [...messages, arr];
        setOldMsg(arr);
      })
      .catch((err) => {
        if (err && err.response && err.response.data && err.response.data.error)
          makeToast("error", err.response.data.error);
      });
  }, [1]);

  const handleChange = (e) => {
    setnewMessage(e.target.value);
  };

  let fromID = localStorage.getItem("user");
  fromID = JSON.parse(fromID);
  //console.log("this is", fromID, "snd to id", toID);
  const sendMessage = () => {
    if (socket) {
      socket.emit("chatroomMessage", {
        fromId: fromID,
        toId: toID,
        message: newMessage,
      });
      setClickSend(!clickSend);
      setnewMessage("");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("CC_Token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    }
    if (socket) {
      socket.on("newMessage", (message) => {
        const newMsg = [...messages, message];
        setMessage(newMsg);
      });
    }
  }, [messages, clickSend]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.emit("joinRoom", {
  //       chatroomId,
  //     });
  //   }

  //   return () => {
  //     //Component Unmount
  //     if (socket) {
  //       socket.emit("leaveRoom", {
  //         chatroomId,
  //       });
  //     }
  //   };
  //   //eslint-disable-next-line
  // }, []);

  return (
    <div>
      <Layout />
      <div className="chatroomPage">
        <div className="chatroomSection">
          <div className="cardHeader">Chat Box</div>
          <div className="chatroomContent">
            <div>
              {oldMsg.length >= 1 &&
                oldMsg.map((message, i) => (
                  <div key={i} className="message">
                    <span
                      className={
                        userId === message.userId
                          ? "ownMessage"
                          : "otherMessage"
                      }
                    >
                      {message.name}:
                    </span>{" "}
                    {message.message}
                  </div>
                ))}
            </div>
            <div>
              {messages.map((message, i) => (
                <div key={i} className="message">
                  <span
                    className={
                      userId === message.userId ? "ownMessage" : "otherMessage"
                    }
                  >
                    {message.name}:
                  </span>{" "}
                  {message.message}
                </div>
              ))}
            </div>
          </div>
          <div className="chatroomActions">
            <div>
              <input
                type="text"
                name="message"
                placeholder="Say something!"
                value={newMessage}
                onChange={handleChange}
              />
            </div>
            <div>
              <button className="join" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Chatroompage);
