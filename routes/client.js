const express = require("express");
const UserRouter = express.Router();
const {handleUser,UserLogin,UserProfile,UpdateUserInfo,logoutUser} = require("../controller/handleuser");
const {isLoggedin} = require("../auth/verifyUser");
//Register
UserRouter.post("/create",handleUser);

//Login
UserRouter.post("/login",UserLogin);

//GetProfile
UserRouter.post("/profile",isLoggedin,UserProfile);

//Update
UserRouter.put("/profile/:id",UpdateUserInfo);

//logout user
UserRouter.get('/logout',logoutUser);

//Delete
// UserRouter.delete();


module.exports = UserRouter;