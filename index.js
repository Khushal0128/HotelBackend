const express = require("express");
const app = express();
const Db = require("./config/connection");
const cookieParser = require("cookie-parser");
const env = require("dotenv");
env.config();

const UserRouter = require("./routes/client");
const HotelOwnerRouter = require("./routes/HotelOwner");
const PORT = process.env.PORT;


app.get("/",(req,res)=>{
    res.json({message:"hello api"});
})

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.COOKIEPASS));

//admins
// app.use("api/v1/dashbord/admin",admin);

// user client

app.use("/api/v1/user",UserRouter);

// hotel owners
app.use("/api/v1/hotelowner",HotelOwnerRouter)

app.listen(PORT,()=>{console.log(`server is runing at port ${PORT}`)});