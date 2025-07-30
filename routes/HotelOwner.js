const express = require("express");
const HotelOwnerRouter = express.Router();
const {handleNewHotel,handleHotelLogin,getHotelProfile,modifyHotelInfo,logoutHotelOwner} = require("../controller/handleHotelOwner");
const {verifyHotelOwner} = require("../auth/VerifyHotelOwner");


HotelOwnerRouter.post("/create",handleNewHotel);

HotelOwnerRouter.post("/login",handleHotelLogin);

HotelOwnerRouter.post("/profile",verifyHotelOwner,getHotelProfile);

HotelOwnerRouter.patch("/profile/:id",verifyHotelOwner,modifyHotelInfo);

HotelOwnerRouter.get("/logout",logoutHotelOwner);

module.exports = HotelOwnerRouter;