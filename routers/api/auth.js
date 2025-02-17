const express = require("express");
const {
  login,

  reVerfiedEmail,
  findUser,
  resetCode,
  verifingCode,
  resetPassword,
  getUserInfo,
  uploadProfilepic,
  uploadCoverepic,
  uploadUserDetails,
  addFriend,
  cancleRequest,
  Follow,
  UnFollow,
  acceptRequest,
  UnFriend,
  deleteRequest,
  search,
  addSearchHistory,
  getSearchHistory,
  removeSearchHistory,
  getAllFriends,
  userRegistrationController,
  verifiedMail,
} = require("../../controllers/userController");
const { authMiddleWare } = require("../../middleWears/authMiddleWare");
const router = express.Router();
router.post("/", userRegistrationController);
router.post("/emailVerifing", authMiddleWare, verifiedMail);
router.post("/reverifing", authMiddleWare, reVerfiedEmail);
router.post("/login", login);
router.post("/resetpassword", findUser);
router.post("/codesend", resetCode);
router.post("/verifingresetcode", verifingCode);
router.post("/changepassword", resetPassword);
router.get("/getuserinfo/:username", authMiddleWare, getUserInfo);
router.put("/uploadprofilepicture", authMiddleWare, uploadProfilepic);
router.put("/uploadcoverpicture", authMiddleWare, uploadCoverepic);
router.put("/uploaduserdtails", authMiddleWare, uploadUserDetails);
router.put("/addfriendrequests/:id", authMiddleWare, addFriend);
router.put("/canclerequest/:id", authMiddleWare, cancleRequest);
router.put("/acceptrequest/:id", authMiddleWare, acceptRequest);
router.put("/follow/:id", authMiddleWare, Follow);
router.put("/unfollow/:id", authMiddleWare, UnFollow);
router.put("/unfriend/:id", authMiddleWare, UnFriend);
router.put("/deleterequest/:id", authMiddleWare, deleteRequest);
router.post("/search/:searchTerm", authMiddleWare, search);
router.put("/addsearchhistory", authMiddleWare, addSearchHistory);
router.get("/getsearchhistory", authMiddleWare, getSearchHistory);
router.put("/removesearchhistory", authMiddleWare, removeSearchHistory);
router.get("/getallfriends", authMiddleWare, getAllFriends);

// when block user will have work some u shoud change(ekta middle ware lagbe(preventBlockedInteractions))

// router.put("/addfriendrequests/:id",authMiddleWare,preventBlockedInteractions, addFriend);
// router.put("/canclerequest/:id",authMiddleWare,preventBlockedInteractions.apply, cancleRequest);
// router.put("/acceptrequest/:id",authMiddleWare,preventBlockedInteractions, acceptRequest);
// router.put("/follow/:id",authMiddleWare,preventBlockedInteractions, Follow);
// router.put("/unfollow/:id",authMiddleWare,preventBlockedInteractions, UnFollow);
// router.put("/unfriend/:id",authMiddleWare,preventBlockedInteractions, UnFriend);
// router.put("/deleterequest/:id",authMiddleWare,preventBlockedInteractions, deleteRequest);

module.exports = router;
