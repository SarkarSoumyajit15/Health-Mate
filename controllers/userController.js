
import User from "../models/usermodel.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/doctormodel.js";

import Notification from "../models/notificationmodel.js";
import Chamber from "../models/chambermodel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




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

const applyDoctor = async(req,res)=>{
  try {
    const reqBody = req.body;
    const demouser = req.user;

    const {firstname,lastname,specialization,phoneNumber,address,feePerConsultation,allTimings} = reqBody;

    const user = await User.findById(demouser.id).select(" _id");
    if(!user) return res.status(401).send({message:"User doesnot exist [While applying for doctor]",success: false});

    // Check if user is already a doctor
    if(user.isDoctor) return res.status(401).send({message:"User is already a doctor",success:false});
    // Check if user has already applied for doctor
    const doctor = await Doctor.findOne({userId:user._id});
    if(doctor) return res.status(401).send({message:"User has already applied for doctor",success:false});

    const chamberLocations = allTimings.map((timing)=>timing.chamberLocation);


    // Create a new doctor
    const newDoctor = new Doctor({
      userId:user._id,
      firstname,
      lastname,
      specialization,
      phoneNumber,
      address,
      feePerConsultation,
    });
    const savedDoctor = await newDoctor.save();

    if(!savedDoctor) return res.status(402).send({message:"New doctor could not be saved in the database",success:false});

    // Now calculate the total number of appointments that can be made in a day at a particular chamber location
      for(let i=0;i<allTimings.length;i++){
        console.log(i);
        const toTime = allTimings[i].toTime;
        if(!toTime) return res.status(401).send({message:"ToTime field is missing",success:false});

        const fromTime = allTimings[i].fromTime;
        if(!fromTime) return res.status(401).send({message:"FromTime field is missing",success:false});

        const toTimeParsed =  Date.parse(toTime);
        const fromTimeParsed =  Date.parse(fromTime);

        const toTimeDated = new Date(toTimeParsed);
        const fromTimeDated = new Date(fromTimeParsed);

        const totalDuration = toTimeParsed - fromTimeParsed;
        const appointmentsNumber = Math.floor(totalDuration / (allTimings[i].durationInMinutes*60000));

        //Calculate the latest start date of appointment : 
        const currentDay = fromTimeDated.getDay();
        let difference = allTimings[i].weekday - currentDay;

        if(difference<0) difference = 7 + difference;

        fromTimeDated.setDate(fromTimeDated.getDate() + difference);
        toTimeDated.setDate(toTimeDated.getDate() + difference);

        
        // now create a new Chamber model and save it in the database
        const newChamber = new Chamber({
          doctorId:savedDoctor._id,
          location:allTimings[i].chamberLocation,
          totalNumberOfAppointments:appointmentsNumber,
          startTime:fromTimeDated,
          endTime:toTimeDated,
          durationInMinutes:allTimings[i].durationInMinutes,
          nextAppointmentSlotStartTime:fromTimeDated,
          weekday:allTimings[i].weekday,
          chamberLocation:allTimings[i].chamberLocation,
        });

        const savedChamber = await newChamber.save();
        if(!savedChamber) return res.status(401).send({message:`Chamber with location : ${allTimings[i].chamberLocation } could not be saved`,success:false});
      }

    // Find the admin
    const admin = await User.findOne({isAdmin:true});
    if(!admin) res.status(400).send({message:"No Admin Account found",success:false});

    // send notifications to admin
    const adminUserId = admin._id;



    const newNotification = new Notification({
      userId:adminUserId,
      message:`${savedDoctor?.firstname} ${savedDoctor?.lastname} has applied for  Doctor Account `,
      onclickPath:'/api/users/doctor-application-details',
      dataToBeSentOnClick : {doctorId : savedDoctor?._id},
      type:'action',
      actionAcceptPath:'/api/users/accept-candidate',
      actionRejectPath:'/api/users/reject-candidate',
      dataToBeSentOnActionAccept : {userId : savedDoctor?.userId},
      dataToBeSentOnActionReject : {userId : savedDoctor?.userId},
    });

    const savedNotification = await newNotification.save();


    return res.status(200).send({message:"Successfully applied for Doctor Account",savedNotification, success : true});

  } catch (error) {
    return res.status(400).json({message : `Error while applying as doctor ${error}`,success : false});
  }

}

const markNotificationAsSeen = async(req,res)=>{
  try{

    const {notificationId} = req.body;
    if(!notificationId) return res.status(400).send({message:"Notification Id is required",success : false});

    const updatedNotification = await Notification.findByIdAndUpdate(notificationId,{isSeen:true},{new:true});
    if(!updatedNotification) return res.status(400).send({message:" Could not find  valid notification",success : false});

    return res.status(200).send({message:"Respective Notification has been moved from unseen to seen ",updatedNotification,success : true});

  }catch(err){
    return res.status(401).json({
      message:"Could not move Notification from unseen to seen ",
      success:false,
      error:err.message,
  });
  }
}

const deleteNotification = async(req,res)=>{
  try{

    const userDemo = req.user;
    const userId = userDemo.id;
    const {notificationId} = req.body;

    const result = await Notification.findByIdAndDelete(notificationId);
    if(!result) return res.status(400).send({message:" Could not find  valid notification",success : false});


    return res.status(200).send({message:`Notification with id : [ ${notificationId} ]  has been removed from  seen Notifications array `,success : true});

  }catch(err){
    return res.status(401).json({
      message:"Could not remove Notification from seen Notifications",
      success:false,
      error:err.message,
  });
  }
};

const deleteAllNotifications = async(req,res)=>{
  try{

    const userDemo = req.user;
    const userId = userDemo.id;

    const user = await User.findById(userId);
    if(!user) return res.status(400).send({message:" Could not find  valid user [ While deleting all notifications ] ",success : false});


    const result = await Notification.deleteMany({ userId: userId });
    console.log(result);
    

    return res.status(200).send({message:" All seen Notifications have been removed from  seen Notifications array ",result,success : true});

  }catch(err){
    return res.status(401).json({
      message:"Could not remove All Notifications from seen Notifications",
      success:false,
      error:err.message,
  });
  }
};

const doctorApplicationDetails = async(req,res)=>{
  try {
    const reqBody = req.body;
    const {doctorId} = reqBody;
  
    const doctor = await Doctor.findById(doctorId).select(" -__v -createdAt -updatedAt -_id");
    if(!doctor) return res.status(401).send({message:"You may have not applied for doctor account ",success : false});
  
    return res.status(200).send({
      message:"Doctor Application Details have been fetched successfully",
      dataToBeDisplayed : doctor,
      success : true,
    })
  
  } catch (err) {
    return res.status(401).send({message : "Doctor Application Details cannot be fetched ",success : false});
  }

}

const fetchUnseenNotifications = async(req,res)=>{
  try {
    const userDemo = req.user;
    const userId = userDemo.id;

    const user = await User.findById(userId);

    if(!user) return res.status(401).send({message:"User doesnot exist [While fetching unseen notifications]",success: false});

    const unSeenNotifications = await Notification.find(
      { 
        userId: user?._id,
        isSeen: false
      }).sort({ createdAt: -1 });  // Sort by most recent first
    

    return res.status(200).send({message:"Unseen Notifications have been fetched successfully",unSeenNotifications,success:true});

  } catch (error) {
    return res.status(401).send({message:"Unseen Notifications could not be fetched",success:false});
  }
}


const fetchSeenNotifications = async(req,res)=>{
  try {
    const userDemo = req.user;
    const userId = userDemo.id;

    const user = await User.findById(userId);

    if(!user) return res.status(401).send({message:"User doesnot exist [While fetching unseen notifications]",success: false});

    const seenNotifications = await Notification.find(
      { 
        userId: user?._id,
        isSeen: true
      }).sort({ createdAt: -1 });  // Sort by most recent first
    

    return res.status(200).send({message:"Unseen Notifications have been fetched successfully",seenNotifications,success:true});

  } catch (error) {
    return res.status(401).send({message:"Unseen Notifications could not be fetched",success:false});
  }
}

const acceptCandidate = async(req,res)=>{
  try {
    const reqBody = req.body;
    const {userId,notificationId} = reqBody;
  
    // Find the doctor with this user Id in the Doctor model
    const doctor = await Doctor.findOne({userId});
    if(!doctor) return res.status(401).send({message:"User did not applied for Doctor Account ",success : false});

  // Update the user schema with isDoctor = true
    const updatedUser = await User.findOneAndUpdate({_id:userId},{isDoctor:true},{new:true});
    if(!updatedUser) return res.status(401).send({message:"Doctor could not be approved",success : false});
    
    // Change the type of the notification to info
    const modifiedNotification = await Notification.findByIdAndUpdate(notificationId,{type:'info'},{new:true});
    if(!modifiedNotification) return res.status(401).send({message:"Doctor could not be rejected [Could not find any notification]",success : false});

    const newNotification = new Notification({
      userId:userId,
      message:` Doctor Account of ${doctor?.firstname} ${doctor?.lastname} has been approved `,
      onclickPath:'/api/users/doctor-application-approval-message',
      dataToBeSentOnClick : {userId : userId},
      type:'info',
      actionAcceptPath:'',
      actionRejectPath:'',
      dataToBeSentOnActionAccept : {},
      dataToBeSentOnActionReject : {},
    });

    const savedNotification = await newNotification.save();

    return res.status(200).send({
      message:"Doctor has been approved successfully",
      updatedUser,
      success : true,
    })
  
  } catch (err) {
    return res.status(401).send({message : "Doctor could not be approved",success : false});
  }


}

const doctorApplicationApprovalMessage = async(req,res)=>{
  try {
    const reqBody = req.body;
    const {userId} = reqBody;
  
    const doctor = await Doctor.findOne({userId});
    if(!doctor) return res.status(401).send({message:"Doctor does not exist",success : false});

    return res.status(200).send({
      message:"Doctor Application Approval Message has been fetched successfully",
      dataToBeDisplayed : {message : `Doctor Account of ${doctor?.firstname} ${doctor?.lastname} has been approved successfully`,doctorId : doctor?._id},
      success : true,
    });

  } catch (err) {
    return res.status(401).send({message : "Doctor Application Approval Message could not be fetched",success : false});
  }
}


const doctorApplicationRejectionMessage = async(req,res)=>{
  try {
    const reqBody = req.body;
    const {userId} = reqBody;
  
    const user = await User.findById(userId);
    if(!user) return res.status(401).send({message:"User does not exist",success : false});

    return res.status(200).send({
      message:"Doctor Application Rejection Message has been fetched successfully",
      dataToBeDisplayed : {message : `Your doctor application has been rejected`},
      success : true,
    });

  } catch (err) {
    return res.status(401).send({message : "Doctor Application Rejection Message could not be fetched",success : false});
  }
}

const rejectCandidate = async(req,res)=>{
  try {
    const reqBody = req.body;
    const {userId,notificationId} = reqBody;
  
    // Find the doctor Id to be rejected
    const doctorIds = await Doctor.find({userId}).select("_id");
    if(!doctorIds) return res.status(401).send({message:"Doctor could not be rejected [Could not find any doctor]",success : false});

    // Delete any chamber schema with this doctor Id in the Chamber model
    const deletedChamber = await Chamber.deleteMany({doctorId:doctorIds[0]._id});
    if(!deletedChamber) return res.status(401).send({message:"Doctor could not be rejected [Could not find any chamber]",success : false});


  // Delete any doctor schema with this user Id in the Doctor model
    const deletedDoctor = await Doctor.deleteMany({userId});
    if(!deletedDoctor) return res.status(401).send({message:"Doctor could not be rejected [Could not find any doctor]",success : false});

    // Change the type of the notification to info
    const modifiedNotification = await Notification.findByIdAndUpdate(notificationId,{type:'info'},{new:true});
    if(!modifiedNotification) return res.status(401).send({message:"Doctor could not be rejected [Could not find any notification]",success : false});
  

    const newNotification = new Notification({
      userId:userId,
      message:` Doctor Application has been rejected `,
      onclickPath:'/api/users/doctor-application-rejection-message',
      dataToBeSentOnClick : {userId : userId},
      type:'info',
      actionAcceptPath:'',
      actionRejectPath:'',
      dataToBeSentOnActionAccept : {},
      dataToBeSentOnActionReject : {},
    });

    const savedNotification = await newNotification.save();

    return res.status(200).send({
      message:"Doctor has been rejected successfully",
      deletedDoctor,
      success : true,
    })
  
  } catch (err) {
    return res.status(401).send({message : "Doctor could not be rejected",success : false});
  }

}

const uploadProfileImage = async(req,res)=>{
  try {
    const reqBody = req.body;
    const userDemo = req.user;
    const userId = userDemo.id;

    const user = await User.findById(userId);
    if(!user) return res.status(401).send({message:"User does not exist",success : false});

    const file = req.file;
    if(!file) return res.status(401).send({message:"File is required",success : false});

    // console.log(file);

    const imageLocalPath = file.path;
    if(!imageLocalPath) return res.status(401).send({message:"Image could not be uploaded [No local path of the image is found to be uploaded to cloudinary i.e. (multer did not work properly)  ]",success : false});



    const imageUrl = await uploadOnCloudinary(imageLocalPath,"profileImages","auto");
    if(!imageUrl) return res.status(401).send({message:"Image could not be uploaded [did not get Cloudinary imageUrl  ] ",success : false});

    user.profileImage = imageUrl.url;

    const savedUser = await user.save();
    const image_url = imageUrl.url;

    if(user.isDoctor){
      const doctor = await Doctor.findOne({userId:user._id});
      if(!doctor) return res.status(401).send({message:"Doctor does not exist [ while updating profile picture ]",success : false});
      doctor.profileimage = image_url;
      const savedDoctor = await doctor.save();
      if(!savedDoctor) return res.status(401).send({message:"Image url could not be saved in the Doctor database",success : false});
    
    }

    if(!savedUser) return res.status(401).send({message:"Image url could not be saved in the database",success : false});



    return res.status(200).send({message:"Image has been uploaded successfully",image_url,success : true});
  } catch (err) {
    return res.status(401).send({message:"Image could not be uploaded", error:err,success : false});
  }
}

const editUserDetails = async(req,res)=>{
  try {
    const reqBody = req.body;
    const userDemo = req.user;
    const userId = userDemo.id;

    const user = await User.findByIdAndUpdate(userId,reqBody,{new:true});
    if(!user) return res.status(401).send({message:"User does not exist",success : false});

    return res.status(200).send({message:"User has been updated successfully",user,success : true});

  } catch (err) {
    return res.status(401).send({message:"User could not be updated", error:err,success : false});
  }
}
    
const fetchUserHistory = async(req,res)=>{
  try {
    const userDemo = req.user;
    const userId = userDemo.id;

    const user = await User.findById(userId);
    if(!user) return res.status(401).send({message:"User does not exist",success : false});

    const historyArray = user.history;
    if(!historyArray) return res.status(401).send({message:"No history found",success : false});

    return res.status(200).send({message:"User history has been fetched successfully",historyArray,success : true});
  } catch (err) {
    return res.status(401).send({message:"User history could not be fetched", error:err,success : false});
  }
}

const appointmentCancellationMessage = async(req,res)=>{ 
  try {
    return res.status(200).send({message:"Appointment Cancellation Message has been fetched successfully",
      dataToBeDisplayed:{message:"Your appointment has been cancelled"},
      success:true});
  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Appointment Cancellation Message could not be fetched",success:false});
  }
}


export {
    registerUser,
    loginUser,
    fetchUserDetails,
    logoutUser,
    applyDoctor,
    markNotificationAsSeen,
    deleteNotification,
    deleteAllNotifications,
    doctorApplicationDetails,
    fetchUnseenNotifications,
    fetchSeenNotifications,
    acceptCandidate,
    rejectCandidate,
    doctorApplicationApprovalMessage,
    doctorApplicationRejectionMessage,
    uploadProfileImage,
    editUserDetails,
    fetchUserHistory,
    appointmentCancellationMessage,
   
};

