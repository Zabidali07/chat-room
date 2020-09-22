const express = require("express");
const router = express.Router();

const {
  listOfAllUsers,
  getAllFriends,
  getAllFriendRequest,
  sendFriendRequest,
  acceptRequest,
  getAllSentRequests,
  getMessage,
  listOfRemUsers,
} = require("../controllers/chatroom");

router.get("/listOfUser", listOfAllUsers);

router.post("/sendFriendRequest", sendFriendRequest);

router.post("/getAllFriends", getAllFriends);

router.get("/getAllFriendRequest", getAllFriendRequest);

router.get("/getAllSentRequests", getAllSentRequests);

router.post("/acceptRequest", acceptRequest);

router.post("/getMessage", getMessage);

router.post("/listOfRemUsers", listOfRemUsers);

module.exports = router;
