const express = require("express");
const HotelOwnerRouter = express.Router();
const {handleNewHotel,handleHotelLogin,getHotelProfile,modifyHotelInfo,logoutHotelOwner} = require("../controller/handleHotelOwner");

HotelOwnerRouter.post("/create",handleNewHotel);

HotelOwnerRouter.post("/login",handleHotelLogin);

HotelOwnerRouter.post("/profile",getHotelProfile);

HotelOwnerRouter.patch("/profile/:id",modifyHotelInfo);

HotelOwnerRouter.get("/logout",logoutHotelOwner);

module.exports = HotelOwnerRouter;