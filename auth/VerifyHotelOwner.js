const jwt = require("jsonwebtoken");
const verifyHotelOwner = async (req,res,next) =>{
    try {
        let isToken = req.signedCookies.token;
        if(!isToken){
            return res.json({"message":"UnAuthorized User","success":false});
        }
        
        let decode = jwt.verify(isToken,process.env.SECRET);
        
         // ✅ ALLOW only if role is hotelOwner
         console.log(decode.role);
         if (decode.payload.role !== "hotelOwner") {
            return res.status(403).json({ message: "Access denied: Not a hotel owner", success: false });
        }

        // ✅ Attach user data to request if needed
        req.user = decode.payload;

        next(); // proceed to the next middleware or route

    } catch (error) {
       return res.json({"message":`UnAuthorized or Token Expired Try To Access UnAuthorized Information`,"success":false}); 
    }
}

module.exports = {verifyHotelOwner};