const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    HotelOwnerName:{
        type:String,
        required:true
    },
    HotelName:{
        type:String,
        required:true
    },
    City:{
        type:String,
        required:true
    },
    HotelId:{
        type:String,
        required:true
    },
    Hoemail:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","hotelOwner"],
        default:"hotelOwner"
    },
    NoOfRooms:{
        type:Number,
        default:0
    }
});
const HotelOwner = mongoose.model("HotelOwner",schema);
module.exports = {HotelOwner};