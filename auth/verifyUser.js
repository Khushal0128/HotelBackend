// const isLoggedin = (req,res,next)=>{
//     try {
//         if(!req.signedCookie.token){
//             return res.json({"message":"Unauthorized user"});
//         }
//         next();
//         // return res.json({"message":"Authorized user"});
//     } catch (error) {
//         return res.json({"message":`${error.message}`});
//     }
// }

// module.exports = {isLoggedin};

const jwt = require("jsonwebtoken");

const isLoggedin = (req, res, next) => {
    try {
        const token = req.signedCookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized user: No token" });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.SECRET);

        // ✅ Attach user info to request (optional but useful)
        req.user = decoded;

        next(); // ✅ Go to the next middleware or route handler

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized user", error: error.message });
    }
};

module.exports = { isLoggedin };
