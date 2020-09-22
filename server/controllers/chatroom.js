const User = require("../models/user");
const Message = require("../models/message");

exports.listOfAllUsers = (req, res) => {
  User.find({}).exec((err, list) => {
    if (err)
      return res.status(400).json({
        error: `unable to get list from database`,
      });

    return res.json({
      result: list,
    });
  });
};

exports.listOfRemUsers = (req, res) => {
  const { id } = req.body;
  let arr = [];
  let friends = [];
  let requests = [];
  let sent = [];

  User.find({}).exec((err, list) => {
    if (err)
      return res.status(400).json({
        error: `unable to get list from database`,
      });

    arr = list;
    //let newArr = arr.filter((e) => e._id !== id);

    User.findOne({ _id: id })
      .populate("friends", "name")
      .populate("friendRequests", "name")
      .populate("sentRequests", "name")
      .exec((err, users) => {
        if (err) {
          return res.json({ error: "Error in fetching friends", err: err });
        }
        friends = users.friends || [];
        requests = users.friendRequests || [];
        sent = users.sentRequests || [];

        let newFriends = friends.map((e) => e._id);
        let newRequests = requests.map((e) => e._id);
        let newSent = sent.map((e) => e._id);
        let key = "_id";
        var first = arr.filter((f) => !newFriends.includes(f._id));
        var second = first.filter((f) => !newRequests.includes(f._id));
        var third = second.filter((f) => !newSent.includes(f._id));
        var fourth = third.filter((f, i) => f[key] != id);
        //  console.log(fourth.indexOf(id));

        return res.json({
          result: fourth,
        });
      });

    //return res.json({ result: newArr });
  });
};

exports.sendFriendRequest = (req, res) => {
  const { userId, friendId } = req.body;

  User.updateOne(
    { _id: userId },
    { $push: { sentRequests: friendId } },
    function (err, raw) {
      if (err) return res.json({ error: "Error in sending friend request" });
    }
  );

  User.updateOne(
    { _id: friendId },
    { $push: { friendRequests: userId } },
    function (err, raw) {
      if (err) return res.json({ error: "Error in adding friends" });
      return res.json({
        result: raw,
        message: "Friend request sent",
      });
    }
  );
};

exports.getAllFriends = (req, res) => {
  const { id } = req.body;

  User.findOne({ _id: id })
    .populate("friends", "name")
    .populate("friendRequests", "name")
    .populate("sentRequests", "name")
    .exec((err, users) => {
      if (err) {
        return res.json({ error: "Error in fetching friends", err: err });
      }
      let friends = users.friends || [];
      let requests = users.friendRequests || [];
      let sent = users.sentRequests || [];

      return res.json({
        result: {
          friends: friends,
          friendReq: requests,
          sentReq: sent,
        },
      });
    });
};

exports.getAllFriendRequest = (req, res) => {
  const { id } = req.body;

  User.findOne({ _id: id })
    .populate("friendRequests", "name")
    .exec((err, users) => {
      if (err) {
        return res.json({ error: "Error in fetching friends" });
      }
      return res.json({
        result: users.friendRequests,
      });
    });
};

exports.acceptRequest = (req, res) => {
  const { userId, acceptId } = req.body;

  User.updateOne(
    { _id: userId },
    { $pull: { friendRequests: acceptId } },
    function (err, raw) {
      if (err) return res.json({ error: "Error in adding friends" });
    }
  );

  User.updateOne({ _id: userId }, { $push: { friends: acceptId } }, function (
    nerr,
    nraw
  ) {
    if (nerr) return res.json({ error: "Error in adding friends" });
  });

  User.updateOne(
    { _id: acceptId },
    { $pull: { sentRequests: userId } },
    function (nerr, nraw) {
      if (nerr) return res.json({ error: "Error in adding friends" });
    }
  );

  User.updateOne({ _id: acceptId }, { $push: { friends: userId } }, function (
    nerr,
    nraw
  ) {
    if (nerr) return res.json({ error: "Error in adding friends" });
    return res.json({
      result: nraw,
      message: "Friend Request Accepted",
    });
  });
};

exports.getAllSentRequests = (req, res) => {
  const { id } = req.body;

  User.findOne({ _id: id })
    .populate("sentRequests", "name")
    .exec((err, users) => {
      if (err) {
        return res.json({ error: "Error in fetching friends" });
      }
      return res.json({
        result: users.sentRequests,
      });
    });
};

exports.getMessage = (req, res) => {
  const { fromID, toID } = req.body;

  let arr = [];
  Message.find({ fromUser: fromID, toUser: toID }, { message: 1, _id: 0 })
    .populate("fromUser", "name")
    .populate("toUser", "name")
    .exec((err, msg) => {
      if (err) {
        return res.json({
          error: "Error in getting messages",
        });
      }
      arr = msg;
    });

  Message.find({ fromUser: toID, toUser: fromID }, { message: 1, _id: 0 })
    .populate("fromUser", "name")
    .populate("toUser", "name")
    .exec((err, msg) => {
      if (err) {
        return res.json({
          error: "Error in getting messages",
        });
      }

      let newArr = arr.concat(msg);
      return res.json({
        result: newArr,
      });
    });
};
