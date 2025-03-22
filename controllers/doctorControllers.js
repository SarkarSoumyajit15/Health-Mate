import Appointment from "../models/appointmentmodel.js";
import Chamber from "../models/chambermodel.js";
import Doctor from "../models/doctormodel.js";
import Notification from "../models/notificationmodel.js";
import User from "../models/usermodel.js";
import {ObjectId} from 'mongodb';

const getEligibleDoctorsWithFilter = async (req, res) => {
  try {
    const { page = 1, limit = 3, specialization, name, location } = req.query;

    const filter = {};
    if (specialization) filter.specialization = specialization;
    if (name) filter.firstname = name;
    if (location) filter.location = location;

    // console.log(filter);

    // write an aggregation query to find the eligible doctors and then lookup them in the Doctors model and match the filters
    const doctors = await User.aggregate([
      {
        $match: { isDoctor: true },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "userId",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $addFields: {
          doctorId: "$doctor._id",
          specialization: "$doctor.specialization",
          firstname: "$doctor.firstname",
          lastname: "$doctor.lastname",
          chamberLocations: "$doctor.chamberLocations",
        },
      },
      {
        $match: filter,
      },
      {
        // Step 6: Pagination - Skip documents for previous pages
        $skip: (page - 1) * limit, // Skip documents based on the page number
      },
      {
        // Step 7: Pagination - Limit the number of documents per page
        $limit: Number(limit), // Limit the number of documents to the defined 'limit'
      },
      {
        $project: {
          _id: 1,
          email: 1,
          username: 1,
          specialization: 1,
          firstname: 1,
          lastname: 1,
          phoneNumber: "$doctor.phoneNumber",
          address: "$doctor.address",
          feePerConsultation: "$doctor.feePerConsultation",
          doctorId: 1,
          profileImage: 1,
          chamberLocations: 1,
        },
      },
    ]);

    // Step 8: Count the total number of documents

    const documents = await User.aggregate([
      {
        $match: { isDoctor: true },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "userId",
          as: "doctor",
        },
      },
      {
        $unwind: "$doctor",
      },
      {
        $addFields: {
          specialization: "$doctor.specialization",
          firstname: "$doctor.firstname",
          lastname: "$doctor.lastname",
        },
      },
      {
        $match: filter,
      },
      {
        $count: "totalDoctors",
      },
    ]);

    const pages =
      documents.length > 0 ? Math.ceil(documents[0].totalDoctors / limit) : 1;

    res
      .status(200)
      .json({
        message: "Filtered doctors fetched successfully",
        doctors,
        pageCount: pages,
        success: true,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error, success: false });
  }
};

const getAllChambers = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const chambers = await Chamber.find({ doctorId });
    if (chambers.length === 0)
      return res
        .status(401)
        .send({
          message:
            "No chamber found [During fetching all the chambers of the respective doctor]",
          success: false,
        });

    return res
      .status(200)
      .send({
        message: "Fetched all chambers successfully",
        chambers,
        success: true,
      });
  } catch (err) {
    return res
      .status(401)
      .send({ message: "Could not fetch chambers", success: false });
  }
};

const getCurrentAppointments = async (req, res) => {
  try {
    // new Date().get;
    let { doctorId } = req.query;

    const doctorObjId = new ObjectId(doctorId);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight of the current day

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the current day
    // console.log(doctorId);

    // const appoi2 = await Appointment.find({doctorId:doctorObjId});
    // console.log(appoi2.length);

    

    const appointments = await Appointment.aggregate([
      {
        $match: {
            // doctorId: doctorObjId,
          $expr: {
            $and: [
              { $eq: ["$doctorId", doctorObjId] },
              { $gte: ["$appointmentDate", startOfDay] },
              { $lte: ["$appointmentDate", endOfDay] },
              { $eq: ["$status", "Booked"] },
            ],
          },
        },
      },
      {
        $sort: {
          appointmentDate: 1 // Sort by time in ascending order
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "patientId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $addFields: {
          email: "$user.email",
          username: "$user.username",
          profileImage: "$user.profileImage",
        },
      },
      {
        $project: {
          _id: 1,
          patientId:1,
          doctorId:1,
          username:1,
          chamberLocation: 1,
          appointmentDate: 1,
          email: 1,
          profileImage: 1,
          documents:1,
        },
      },
    ]);
    if (appointments.length === 0)
      return res
        .status(200)
        .send({ message: "No appointments found", success: true });

    
    return res
      .status(200)
      .json({
        message: "Fetched all appointments successfully",
        appointments,
        success: true,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .send({ message: "Could not fetch appointments",err,success: false });
  }
};

const fetchDoctorHistory = async(req,res)=>{
  try {
   const {doctorId} = req.query;
    const doctorObjId = new ObjectId(doctorId);

    const doctor = await Doctor.findById(doctorObjId);
    if(!doctor) return res.status(401).send({message:"Doctor not found",success:false});

    // Now fetch the history of the doctor
    const historyArray = doctor.history;
    if(!historyArray) return res.status(200).send({message:"No history found",success:true}); // No history found

    return res.status(200).send({message:"Fetched doctor history successfully",historyArray,success:true});

  } catch (err) {
    return res.status(401).send({message:"Could not fetch doctor history",success:false});
  }
};

const fetchDoctorInfo = async(req,res)=>{
  try {
    const {doctorId} = req.query;
    const doctorObjId = new ObjectId(doctorId);

    const doctorInfo = await Doctor.findById(doctorObjId).select('-_id firstname lastname address phoneNumber specialization feePerConsultation');
    if(!doctorInfo) return res.status(401).send({message:"Doctor not found while fetching doctor infos",success:false});

    // console.log(doctorInfo);

    const doctorTimings = await Doctor.aggregate([
      {
        $match:{
          _id:doctorObjId
        }
      },
      {
        $lookup:{
          from:"chambers",
          localField:"_id",
          foreignField:"doctorId",
          as:"chambers"
        }
      },
      {
        $unwind:"$chambers"
      },
      {
        $addFields:{
          chamberLocation:"$chambers.chamberLocation",
          weekday : "$chambers.weekday",
          durationInMinutes:"$chambers.durationInMinutes",
          fromTime : "$chambers.startTime",
          toTime : "$chambers.endTime",
        }
      },
      {
        $project:{
          _id:0,
          chamberLocation:1,
          weekday:1,
          durationInMinutes:1,
          fromTime:1,
          toTime:1,
        }
      }
    ]);

    if(doctorTimings.length === 0) return res.status(200).send({message:"No timings found",success:true});

    const doctorInfos = {...doctorInfo._doc,allTimings:doctorTimings};

    // console.log(doctorInfos);

    // doctorInfos.allTimings = doctorTimings;

    return res.status(200).send({message:"Fetched doctor infos successfully",doctorInfos,success:true});

  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not fetch doctor infos",success:false});
  }
};

const requestForEditDoctorInfo = async(req,res)=>{  
  try {
    const {doctorId , doctorInfo} = req.body;

    const admin = await User.findOne({isAdmin:true});
    if(!admin) res.status(400).send({message:"No Admin Account found",success:false});

    const newNotificationToAdmin = new Notification({
      userId:admin._id,
      message:`Doctor with ID : ${doctorId} has requested for editing his/her info`,
      onclickPath:'/api/doctors/show-edit-doctor-details',
      dataToBeSentOnClick : {doctorId,doctorInfo},
      type:"action",
      actionAcceptPath:"/api/doctors/edit-doctor-info",
      actionRejectPath:"/api/doctors/reject-edit-doctor-info",
      dataToBeSentOnActionAccept:{doctorId,doctorInfo},
      dataToBeSentOnActionReject:{doctorId},
    });

    const savedNotificationToAdmin = await newNotificationToAdmin.save();
    if(!savedNotificationToAdmin) return res.status(401).send({message:"Could not save the notification",success:false});

    const newNotificationToDoctor = new Notification({
      userId:req.user.id,
      message:`Request for editing doctor info sent successfully`,
      onclickPath:'/api/doctors/show-edit-doctor-details',
      dataToBeSentOnClick : {doctorId,doctorInfo},
      type:"info",
    });

    const savedNotificationToDoctor = await newNotificationToDoctor.save();
    if(!savedNotificationToDoctor) return res.status(401).send({message:"Could not save the notification",success:false});



    return res.status(200).send({message:"Request for editing doctor info sent successfully",success:true});

  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not request for editing doctor info",success:false});
  }
}

const showEditDoctorDetails = async(req,res)=>{
  try {
    const {doctorId , doctorInfo} = req.body;
    const doctorObjId = new ObjectId(doctorId);

    const doctor = await Doctor.findById(doctorObjId);
    if(!doctor) return res.status(401).send({message:"Doctor not found while showing edit doctor details",success:false});

    return res.status(200).send({message:"Edit Doctor details fetched successfully",dataToBeDisplayed:doctorInfo,success:true});
    
  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not show edit doctor details",success:false});
  }
}

const rejectEditDoctorInfo = async(req,res)=>{
  try {
    const {doctorId} = req.body;
    const doctorObjId = new ObjectId(doctorId);

    const doctor = await Doctor.findById(doctorObjId);
    if(!doctor) return res.status(401).send({message:"Doctor not found while rejecting edit doctor info",success:false});

    const newNotificationToDoctor = new Notification({
      userId:doctor.userId,
      message:`Request for editing doctor info rejected`,
      onclickPath : '/api/doctors/show-edit-doctor-info-rejection-message',
      type:"warning",
    });

    const savedNotificationToDoctor = await newNotificationToDoctor.save();
    if(!savedNotificationToDoctor) return res.status(401).send({message:"Could not save the notification",success:false});

    return res.status(200).send({message:"Rejected Edit doctor info successfully",success:true});

  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not reject  Edit doctor info",success:false});
  }
}

const showEditDoctorInfoRejectionMessage = async(req,res)=>{
  try {
    return res.status(200).send({message:"Edit doctor info rejected successfully",dataToBeDisplayed:{message : "Your request for editing some of your Details is rejected by the admin"} , success:true});
  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not show edit doctor info rejection message",success:false});
  }
}

const editDoctorInfo = async(req,res)=>{
  try {
    const {doctorId , doctorInfo,notificationId} = req.body;
    const doctorObjId = new ObjectId(doctorId);

    const {firstname,lastname,address,phoneNumber,specialization,feePerConsultation,allTimings} = doctorInfo;

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorObjId,{
      firstname,
      lastname,
      address,
      phoneNumber,
      specialization,
      feePerConsultation,
    },{new:true});

    if(!updatedDoctor) return res.status(401).send({message:"Doctor not found while editing doctor info",success:false});  // Doctor not found

    // delete all previous chambers of the doctor
    const deletedChambers = await Chamber.deleteMany({doctorId:doctorObjId});
    if(!deletedChambers) return res.status(401).send({message:"Could not delete previous chambers",success:false});
    

    // Now add the new chambers :

    for(let i=0;i<allTimings.length;i++){
      // console.log(i);
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
        doctorId:updatedDoctor._id,
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


    // change the type of the previous notification to info : 
    const prevNotification = await Notification.findByIdAndUpdate(notificationId,{type:"info"},{new:true});
    if(!prevNotification) return res.status(401).send({message:"Could not change the type of the previous notification",success:false});
    

    const newNotificationToDoctor = new Notification({
      userId:updatedDoctor.userId,
      message:`Doctor info edited successfully`,
      onclickPath : '/api/doctors/show-edit-doctor-info-success-message',
      type:"info",
    });

    const savedNotificationToDoctor = await newNotificationToDoctor.save(); 
    if(!savedNotificationToDoctor) return res.status(401).send({message:"Could not save the notification",success:false});

    return res.status(200).send({message:"Edited doctor info successfully",success:true});

  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not edit doctor info",success:false});
  }
}

const showEditDoctorInfoSuccessMessage = async(req,res)=>{
  try {
    return res.status(200).send({message:"Edit doctor info success message shown successfully",dataToBeDisplayed:{message : "Your request for editing some of your Details is accepted by the admin"} , success:true});
  } catch (err) {
    console.log(err);
    return res.status(401).send({message:"Could not show edit doctor info success message",success:false});
  }
}


export { 
  getEligibleDoctorsWithFilter,
  getAllChambers,
  getCurrentAppointments,
  fetchDoctorHistory,
  fetchDoctorInfo,
  requestForEditDoctorInfo,
  showEditDoctorDetails,
  rejectEditDoctorInfo,
  showEditDoctorInfoRejectionMessage,
  editDoctorInfo,
  showEditDoctorInfoSuccessMessage,
};
