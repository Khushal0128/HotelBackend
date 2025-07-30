const bcrypt = require("bcrypt");
const {HotelOwner} = require("../model/HotelOwner");
let cypto = require("crypto");
const jwt = require("jsonwebtoken");

const handleNewHotel = async (req,res) =>{
    const {hotelownername,hotelowneremail,hotelname,password,city} = req.body;
    let hotelId = cypto.randomBytes(8).toString('hex');

    try {

        // let isExistId =await HotelOwner.find({hotelId});

        // if(isExistId){
        //    hotelId = hotelId.concat(Math.random(0,5));
        // }

        const HotelOwnerIsExist = await HotelOwner.findOne({ Hoemail: hotelowneremail });
        if (HotelOwnerIsExist) {
            return res.status(409).json({ message: "User already exists" });
        }


        const SALT =await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password,SALT);

        let newHotel = await HotelOwner.create({
            HotelOwnerName:hotelownername,
            HotelId:hotelId,
            HotelName:hotelname,
            Hoemail:hotelowneremail,
            password:hashedPassword,
            City:city
        });
        return res.status(201).json({"message":"Registered SuccessFully"})
    } catch (error) {
        res.json({"message":`message ${error.message}`});
    }
}
const handleHotelLogin = async (req,res) =>{
    try {
        let {hotelowneremail,password} = req.body;

        const isExist = await HotelOwner.findOne({Hoemail:hotelowneremail});

        console.log(isExist);

        if(!isExist){
            return res.json({"message":"User Is Not Found"});
        }

        let isSamePassword = await bcrypt.compare(password,isExist.password);

        if(!isSamePassword){
            return res.json({"message":"Incorrect Email or password"});
        }

        let objPaylod = {
            "id":isExist._id,
            "email":isExist.Hoemail,
            "role":isExist.role,
        }

        let token = jwt.sign(objPaylod,process.env.SECRET,{expiresIn:"1D"});

        res.cookie("token",token,{
            maxAge:1000 * 60 * 60 * 24,
            httpOnly:false,
            signed:true
        })

        res.json({"message":{
            objPaylod,
            "token":token,
            "success":true
        }});
        // console.log(hotelowneremail);
        // console.log(password);
    } catch (error) {
        res.json({"message":`$Unauthorized user or ${error.message}`});
    }
}
const getHotelProfile = async (req,res) =>{
    try {
        let isExistToken = req.signedCookies.token;
        if(!isExistToken){
            return res.json({"message":"UnAuthenticate User"});
        }
        let decode = jwt.verify(isExistToken,process.env.SECRET);

        const id = decode.id;
        let getHotelOwner = await HotelOwner.findById(id).select("-password");

        if(!getHotelOwner){
            return res.json({"message":"User Is Not Matched"})
        }

        return res.json({"message":"User Fetched SuccessFully","user":getHotelOwner});

    } catch (error) {
        return res.json({"message":`something went wrond ${error.message}`});
    }   
}
const modifyHotelInfo = async (req,res) =>{
    const {hotelownername,hotelowneremail,hotelname,password,city} = req.body;
    
}

const logoutHotelOwner = async (req,res) =>{
    if(!req.signedCookies.token){
        return res.json({"message":"User Is Not Loggedin"});
    }
    res.clearCookie("token");
    return res.json({"message":"User logged out successfully"});
}

module.exports = {handleNewHotel,handleHotelLogin,getHotelProfile,modifyHotelInfo,logoutHotelOwner};