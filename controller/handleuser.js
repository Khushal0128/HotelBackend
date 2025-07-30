const {User} = require("../model/UserModel");
const bcrypt = require("bcrypt");
const env = require("dotenv");
const jwt = require("jsonwebtoken");
env.config();

// console.log(process.env.SALT);
const handleUser = async (req,res)=>{
    let {username,email,password} = req.body;

    let ifExist =await User.findOne({email});
    if(ifExist){
        return res.json({"message":"User Is Aready Exist"});
    }

    try {
        const SALT =await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password,SALT);

        const createUser =await User.create({username,email,password:hashedPassword});
        if(!createUser){
            return res.json({"message":"creation error","success":false});
        }
        return res.json({"message":"User Successfully Created"});
    } catch (error) {
        return res.json({"message":"something went wrong","error":`${error.message}`});
    }
}

const UserLogin = async (req,res)=>{
    let {email,password} = req.body;

    try {

        let isExist =await User.findOne({email});
        if(!isExist){
            return res.json({ message: "Invalid email or password" });
        }
        
        const GetUser = await User.findOne({email});

        // console.log(GetUser);

        let isSamePassword =await bcrypt.compare(password,GetUser.password);
        if(!isSamePassword){
            return res.json({ message: "Invalid email or password" });
        }

        const payload = await User.findOne({email});
        const objPayload = {
            "id":payload._id,
            "name":payload.username,
            "role":payload.role
        }

        let token = jwt.sign(
            objPayload,
            process.env.SECRET,
            {expiresIn:'1D'}
        );

        res.cookie("token",token,{
            maxAge:1000 * 60 * 60 * 24,
            httpOnly:false,
            signed:true
        });

        return res.json({"message":"Logged In Successfully","payload":objPayload,"token":token});

    } catch (error) {
        return res.json({"message":`${error.message}`});
    }
}

const UserProfile = async (req,res)=>{
    try {

        const token = req.signedCookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        let decode = jwt.verify(req.signedCookies.token,process.env.SECRET);
       
        const userInfo = await User.findById(decode.id).select("-password");

        if (!userInfo) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "User profile fetched successfully",
            user: userInfo
        });

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
}

const UpdateUserInfo = async (req,res)=>{
    // let {id} = req.prams;
    let {id} = req.params;
    let {username,email} = req.body;

    const checkEmail = await User.findOne({email}).countDocuments();

    const isExistUser = await User.findById(id);
    
    if(!isExistUser){
        return res.json({"message":"User Is Not Found","success":false});
    }

    // Check if the email is already used by another user
    if (checkEmail > 0) {
        return res.status(400).json({ message: "Email is already in use", success: false });
    }

    let Updateuser = await User.findByIdAndUpdate(id,{username,email}, { new: true } );

    if(!Updateuser){
        return res.json({"message":"someting went wrong"});
    }
  
    return res.json({
        "message":`update User info ${id}`,
        "user":Updateuser
    });
}

const logoutUser = async(req,res)=>{
    if(!req.signedCookies.token){
        return res.json({"message":"User Is Not Loggedin"});
    }
    res.clearCookie("token");
    return res.json({"message":"User logged out successfully"});
}



module.exports = {handleUser,UserLogin,UserProfile,UpdateUserInfo,logoutUser};