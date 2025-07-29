const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    username :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","hotelOwner"],
        default:"user"
    },
    crearedAt:{
        type:Date,
        default:Date.now()
    }
});

const User = mongoose.model("users",schema);
module.exports = {User};