const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (token) => {
    // const authHeader = req.headers.authorization;
    // console.log(token)
    if (!token || !token.startsWith("Bearer ")) {
        throw new Error("Missing token or Provide a valid Bearer token.");
    }
    
    const extractedToken = token.split(" ")[1];

    try {
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        return { id: decoded.id, role: decoded.role }; 
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.error("UNAUTHENTICATED:", error.message);
            throw new Error("Token has expired.");
        }
        else{
            console.error("Invalid token:", error.message);
            throw new Error("Invalid token");
        }
    }
};

const customerAuthorization = ( user ) => {
    if (!user) {
        throw new Error("Please log in.");
    }
    if (user.role !== "customer") {
        throw new Error("Unauthorized access");
    }
}

const workerAuthorization = ( user ) => {
    if (!user) {
        throw new Error("Please log in.");
    }
    if (user.role !== "worker") {
        throw new Error("Unauthorized access");
    }
}


module.exports =  { authenticateUser, customerAuthorization,workerAuthorization };
