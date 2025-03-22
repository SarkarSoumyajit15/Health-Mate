

import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';

const authenticateToken = async(req, res, next)=>{
    // Get token from cookies
    const token = req.cookies.token;

    // If no token is found, send unauthorized status
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.',success:false });
    }

    // Verify the token
    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET); // Verifying token with the secret key
        // console.log(verifiedUser);
        
        req.user = verifiedUser;  // Attach the verified user data to the request object
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token.',success:false}); // Send forbidden status if token is invalid
    }
}



const authenticateAdmin = async (req,res,next)=>{
    try {
        const userDemo = req.user;
        const userId = userDemo.id;
    
        const user = await User.findById(userId);
        if(!user) return res.status(401).send({message : "Possibly you are not the admin",success : false});

        if(!user?.isAdmin) return res.status(401).send({message : " You are not the admin",success : false});
        
        next(); 
    } catch (error) {
        res.status(401).send({message : "Possibly you are not the admin",success : false});
    }
}

const authenticateDoctor = async (req,res,next)=>{
    try {
        const userDemo = req.user;
        const userId = userDemo.id;
    
        const user = await User.findById(userId);
        if(!user) return res.status(401).send({message : "Possibly you are not the doctor",success : false});

        if(!(user?.isDoctor)) return res.status(401).send({message : " You are not the doctor",success : false});

        next();
    }
    catch (error) {
        res.status(401).send({message : "Possibly you are not the doctor",success : false});
    }
}


export {
    authenticateAdmin,
}

export default authenticateToken;