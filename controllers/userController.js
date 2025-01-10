
import User from "../models/usermodel.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctormodel.js";



const registerUser = async(request,res)=>{
  try {
    // take the data from the request
    const reqBody = await request.body;
    const { username, email, password } = reqBody;

    const user = await User.findOne({ email });

    // Check if user is already registered
    if (user) {
      return res.status(400).json({message : "User already exist",success : false});
    }

    // if not registered , then register now

    // generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // save the user in the database

    const savedUser = await newUser.save();

    if(savedUser){
      return res.status(200).send({message : "User created Successfully",success : true});
    }

    
  } catch (error) {
    return res.status(400).json({message : `Error while signup user ${error}`,success : false});
  }
};

const loginUser = async(req,res)=>{
  try {
    const reqBody = await req.body;

    const {email,password} = reqBody;

    const user = await User.findOne({email});


    if(!user){
        return  res.status(401).send({message :"Email does not exist",success:false});
    }

    const hashedPassword = user.password;

    const isPasswordValid = await bcrypt.compare(password,hashedPassword);

    if(!isPasswordValid)
        return res.status(401).send({message:"Incorrect Password",success:false});

    const tokenData = {
        id : user._id,
    }

    const token = jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn : '1d'});

    const options = {
      httpOnly: true,
      secure: true,
      // sameSite: 'None', // Required for cross-site requests
      maxAge: 24 * 60 * 60 * 1000
    };

    res.cookie("token",token,options);

    return res.status(200).send({message:"User logged in successfully",success:true});


} catch (error) {
    res.status(401).json({message : "Error while log in",success:false});
}  
}

const fetchUserDetails = async(req,res)=>{
  try{


    const userDemo = req.user;
    const userId = userDemo.id;

    let user = await User.findById(userId).select("_id isDoctor isAdmin username email profileImage");

    if(!user) return res.status(400).send({message:" Could not find  valid user",success : false});

    if(user.isDoctor){
      const doctor = await Doctor.findOne({userId:user._id}).select(" _id ");
      user = {...user.toObject(),doctorId:doctor?._id}; 

    }
    

    // console.log(user);
    


    return res.status(200).send({
      authenticated: true,
      success:true,
      user,
  });
  }catch(err){
    return res.status(401).json({
      message:"UserId found has some error while verification",
      authenticated: false,
      success:false,
      error:err.message,
  });
  }
};

const logoutUser = async(req,res)=>{


    const options = {
        httpOnly: true,
        secure: true,
      };

    return res
    .status(200)
    .clearCookie("token", options)
    .json({message:"User logged Out Successfully",success : true});
}





export {
    registerUser,
    loginUser,
    fetchUserDetails,
    logoutUser,
   
};

