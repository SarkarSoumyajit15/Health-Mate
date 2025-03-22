import Appointment from "../models/appointmentmodel.js";
import Chamber from "../models/chambermodel.js";
import Doctor from "../models/doctormodel.js";
import Notification from "../models/notificationmodel.js";
import User from "../models/usermodel.js";
import { ObjectId } from "mongodb";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const updateChamberAfterAppointmentBooked = async (
  chamberId,
  nextAppointmentSlotStartTime,
  startTime,
  endTime,
  durationInMinutes
) => {
  try {
    // Get the duration of each appointment
    // const { durationInMinutes, nextAppointmentSlotStartTime, endTime, startTime, weekday } = chamber;

    // Calculate the new nextAppointmentSlotStartTime by adding duration
    let updatedSlotStartTime = new Date(nextAppointmentSlotStartTime.getTime());
    // console.log("hi");
    updatedSlotStartTime.setMinutes(
      updatedSlotStartTime.getMinutes() + durationInMinutes
    );

    // console.log(updatedSlotStartTime.getMinutes());

    // If the updatedSlotStartTime exceeds the endTime for the day, move to the next week
    if (updatedSlotStartTime > endTime) {
      // Move to the next week's same weekday
      const daysToNextWeek = 7; // Jump to the same day of the next week
      let nextWeekStartTime = new Date(startTime);
      let nextWeekEndTime = new Date(endTime);

      nextWeekStartTime.setDate(nextWeekStartTime.getDate() + daysToNextWeek);
      nextWeekEndTime.setDate(nextWeekEndTime.getDate() + daysToNextWeek);

      // Set next appointment slot to the start time of the next week's same day
      const updatedChamber = Chamber.findByIdAndUpdate(
        chamberId,
        {
          nextAppointmentSlotStartTime: nextWeekStartTime,
          startTime: nextWeekStartTime,
          endTime: nextWeekEndTime,
        },
        { new: true }
      );
      if (!updatedChamber)
        return new Error({
          message:
            "Could not update the chamber after booking the current appointment",
          success: false,
        });
      // chamber.nextAppointmentSlotStartTime = nextWeekStartTime;
      // chamber.startTime = nextWeekStartTime;
      // chamber.endTime = nextWeekEndTime;
      console.log("hi1");
      return updatedChamber;
    } else {
      // If still within today's slots, just update the nextAppointmentSlotStartTime
      const updatedChamber = Chamber.findByIdAndUpdate(
        chamberId,
        { nextAppointmentSlotStartTime: updatedSlotStartTime },
        { new: true }
      );

      if (!updatedChamber)
        return new Error({
          message:
            "Could not update the chamber after booking the current appointment",
          success: false,
        });

      if (
        updatedChamber.nextAppointmentSlotStartTime <
        nextAppointmentSlotStartTime
      )
        return new Error({
          message:
            "Could not update the chamber after booking the current appointment",
          success: false,
        });
      // chamber.nextAppointmentSlotStartTime = updatedSlotStartTime;
      console.log("hi2");
      return updatedChamber;
    }

    // Save the updated chamber
  } catch (err) {
    return new Error({
      message:
        "Could not update the chamber after booking the current appointment",
      error: err,
      success: false,
    });
  }
};

const fetchLatestAppointmentTimingsPossibleWithFilters = async (req, res) => {
  try {
    const reqBody = req.body;
    const { doctorId, chamberId } = reqBody;

    const chamberWithFilters = await Chamber.findById(chamberId);
    if (!chamberWithFilters)
      return res.status(401).send({
        message: "No chamber found with the given chamberId",
        success: false,
      });

    const chamber = chamberWithFilters;

    // const chamberId = chamber._id;
    let nextAppointmentSlotStartTime = chamber.nextAppointmentSlotStartTime;
    let startTime = chamber.startTime;
    let endTime = chamber.endTime;
    let weekday = chamber.weekday;

    if (nextAppointmentSlotStartTime.getTime() < new Date().getTime()) {
      nextAppointmentSlotStartTime = new Date(new Date().getTime());
      let difference = chamber.weekday - new Date().getDay();
      if (difference < 0) difference += 7;

      if (difference === 0) {
        startTime = new Date(new Date().getTime());
        endTime = new Date(new Date().getTime());

        startTime.setHours(
          chamber.startTime.getHours(),
          chamber.startTime.getMinutes(),
          chamber.startTime.getSeconds()
        );
        endTime.setHours(
          chamber.endTime.getHours(),
          chamber.endTime.getMinutes(),
          chamber.endTime.getSeconds()
        );

        const currentTime = new Date(new Date().getTime());

        if (currentTime > startTime && currentTime < endTime) {
          nextAppointmentSlotStartTime = new Date(
            currentTime.getTime() + 30 * 60000
          ); // 30 minutes later [Atleast give 30 minutes to arrive]
        } else if (currentTime > endTime) {
          // Next week

          startTime.setDate(startTime.getDate() + 7);
          nextAppointmentSlotStartTime = startTime;
        } else if (currentTime < startTime) {
          // today itself
          nextAppointmentSlotStartTime = startTime;
        }
      } else {
        startTime = new Date(new Date().getTime());
        // set the starttime and endtime to the next date's chamber timings
        startTime.setDate(startTime.getDate() + difference);
        startTime.setHours(
          chamber.startTime.getHours(),
          chamber.startTime.getMinutes(),
          chamber.startTime.getSeconds()
        );
        nextAppointmentSlotStartTime = startTime;
        endTime = startTime;
        endTime.setHours(
          chamber.endTime.getHours(),
          chamber.endTime.getMinutes(),
          chamber.endTime.getSeconds()
        );
      }

      const updatedChamber = await Chamber.findByIdAndUpdate(
        chamberId,
        { nextAppointmentSlotStartTime, startTime, endTime },
        { new: true }
      );
      if (!updatedChamber)
        return res.status(401).send({
          message:
            "Could not update the chamber [ Now i have to time travel to my past to book the appointment ha ha ha]",
          success: false,
        });
    }

    // final check if the nextAppointmentSlotStartTime is less than the current time [though i have checked necessary conditions above]
    const availableDate = nextAppointmentSlotStartTime;
    if (availableDate.getTime() < new Date().getTime()) {
      return res.status(401).send({
        message:
          "Ops , I messed up something with the timings [ You can still book the appointment if you can time travel to your past ha ha ha ]",
        success: false,
      });
    }

    return res.status(200).send({
      message: "Fetched the latest appointment timings successfully",
      availableDate,
      success: true,
    });
  } catch (err) {
    return res.status(401).send({
      message: "Could not fetch the latest appointment timings",
      error: err,
      success: false,
    });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const reqBody = req.body;
    const { doctorId, chamberId } = reqBody;
    const demoUser = req.user;
    const patientId = demoUser.id;

    const chamber = await Chamber.findById(chamberId);
    if (!chamber)
      return res
        .status(401)
        .send({ message: "No chamber found for the doctor", success: false });

    // Access uploaded files
    const files = req.files;

    // Array to store Cloudinary upload results
    const uploadResults = [];

    // Upload files to Cloudinary
    for (const file of files) {
      const filePath = file.path;

      // Upload to Cloudinary
      const result = await uploadOnCloudinary(filePath, "documents", "auto");
      if(!result) return res.status(401).send({ message: "Could not upload the document in the cloudinary", success: false });

      // Push upload result to the array
      uploadResults.push(result);
      console.log(result);

    }

    // const docUrls =  uploadResults.map((result) => result.url);


    const appointment = new Appointment({
      doctorId,
      patientId,
      appointmentDate: chamber.nextAppointmentSlotStartTime,
      status: "Booked",
      chamberLocation: chamber.chamberLocation,
      documents:uploadResults,
    });

    const savedAppointment = await appointment.save();

    if (!savedAppointment)
      return res.status(401).send({
        message: "Could not book the appointment [Appointment Schema error]",
        success: false,
      });

    // Update the chamber
    const updatedChamber = await updateChamberAfterAppointmentBooked(
      chamberId,
      chamber.nextAppointmentSlotStartTime,
      chamber.startTime,
      chamber.endTime,
      chamber.durationInMinutes
    );
    if (!updatedChamber)
      return res.status(401).send({
        message:
          "Could not update the chamber after booking the current appointment",
        success: false,
      });
    // chamber.nextAppointmentSlotStartTime = new Date(chamber.nextAppointmentSlotStartTime.getTime() + chamber.durationInMinutes * 60000);
    // const updatedChamber = await chamber.save();

    const newNotificationToDoctor = new Notification({
      userId: doctorId,
      message: `New appointment booked for ${chamber.nextAppointmentSlotStartTime}`,
      type: "info",
      onclickPath: "/api/appointments/fetch-appointment-details",
      dataToBeSentOnClick: { appointmentId: savedAppointment._id },
    });

    const savedNotificationToDoctor = await newNotificationToDoctor.save();
    if (!savedNotificationToDoctor)
      return res.status(401).send({
        message: "Could not send notification to the doctor",
        success: false,
      });

    const newNotificationToPatient = new Notification({
      userId: patientId,
      message: `Appointment booked for ${chamber.nextAppointmentSlotStartTime}`,
      type: "info",
      onclickPath: "/api/appointments/fetch-appointment-details",
      dataToBeSentOnClick: { appointmentId: savedAppointment._id },
    });

    const savedNotificationToPatient = await newNotificationToPatient.save();
    if (!savedNotificationToPatient)
      return res.status(401).send({
        message: "Could not send notification to the patient",
        success: false,
      });

    return res
      .status(200)
      .send({ message: "Booked the appointment successfully", success: true });
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      message: "Could not book the appointment",
      error: err,
      success: false,
    });
  }
};

const fetchAppointmentDetails = async (req, res) => {
  try {
    const reqBody = req.body;
    const { appointmentId } = reqBody;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res
        .status(401)
        .send({ message: "No appointment found", success: false });

    return res.status(200).send({
      message: "Fetched the appointment details successfully",
      dataToBeDisplayed: appointment,
      success: true,
    });
  } catch (err) {
    return res.status(401).send({
      message: "Could not fetch the appointment details",
      success: false,
    });
  }
};

const addPrescription = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const prescriptionPdf = req.file;

    if (!appointmentId)
      return res
        .status(401)
        .send({ message: "No appointmentId found", success: false });

    if (!prescriptionPdf)
      return res
        .status(401)
        .send({ message: "No prescription file found", success: false });

    // now upload the presciption in the cloudinary and store the url in the appointment schema prescription field
    const uploadedPrescription = await uploadOnCloudinary(
      prescriptionPdf.path,
      "prescriptions",
      "raw"
    );
    if (!uploadedPrescription)
      return res
        .status(401)
        .send({
          message: "Could not upload the prescription in the cloudinary",
          success: false,
        });

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { prescriptionUrl: uploadedPrescription.url },
      { new: true }
    );
    if (!updatedAppointment)
      return res
        .status(401)
        .send({
          message:
            "Could not update the appointment schema with the prescriptionUrl",
          success: false,
        });

    return res
      .status(200)
      .send({ message: "Prescription added successfully", success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({
        message: "Could not add the prescription while handling with it ",
        err,
        success: false,
      });
  }
};

const addPrescriptionAndCompleteAppointment = async (req, res) => {
  try {
    const reqBody = req.body;
    const { appointmentId, doctorId, patientId } = reqBody;

    const prescriptionPdf = req.file;

    if (!appointmentId)
      return res
        .status(401)
        .send({ message: "No appointmentId found", success: false });
    let uploadedPrescriptionUrl = null;
    if (prescriptionPdf) {
      const uploadedPrescription = await uploadOnCloudinary(
        prescriptionPdf.path,
        "prescriptions",
        "raw"
      );
      if (!uploadedPrescription)
        return res
          .status(401)
          .send({
            message: "Could not upload the prescription in the cloudinary",
            success: false,
          });

      uploadedPrescriptionUrl = uploadedPrescription.url;

      const updatedAppointment1 = await Appointment.findByIdAndUpdate(
        appointmentId,
        { prescriptionUrl: uploadedPrescription?.url },
        { new: true }
      );
      if (!updatedAppointment1)
        return res
          .status(401)
          .send({
            message: "Could not update the appointment status",
            success: false,
          });
    }

    // now upload the presciption in the cloudinary and store the url in the appointment schema prescription field

    // fetch the appointment by appointmentId and update the status to completed

    const updatedAppointment2 = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: "Completed" },
      { new: true }
    );
    if (!updatedAppointment2)
      return res
        .status(401)
        .send({
          message: "Could not update the appointment status",
          success: false,
        });

    // fetch the patient name and doctor name
    const patientName = await User.findById(patientId).select("username");
    if (!patientName)
      return res
        .status(401)
        .send({ message: "Could not fetch the patient name", success: false });

    const doctorName = await Doctor.findById(doctorId).select(
      "firstname lastname"
    );
    if (!doctorName)
      return res
        .status(401)
        .send({ message: "Could not fetch the doctor name", success: false });

    // now add the appointment id in the users and doctors schema's history field

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      {
        $push: {
          history: {
            appointmentId,
            title: ` Appointment with ${patientName.username} `,
            date: updatedAppointment2.appointmentDate,
            prescriptionUrl: uploadedPrescriptionUrl,
          },
        },
      },
      { new: true }
    );
    if (!updatedDoctor)
      return res
        .status(401)
        .send({
          message: "Could not update the doctor's history field",
          success: false,
        });

    const updatedPatient = await User.findByIdAndUpdate(
      patientId,
      {
        $push: {
          history: {
            appointmentId,
            title: ` Appointment with dr ${doctorName.firstname} ${doctorName.lastname}`,
            date: updatedAppointment2.appointmentDate,
            prescriptionUrl: uploadedPrescriptionUrl,
          },
        },
      },
      { new: true }
    );
    if (!updatedPatient)
      return res
        .status(401)
        .send({
          message: "Could not update the patient's history field",
          success: false,
        });

    return res
      .status(200)
      .send({
        message: "Appointment has been completed successfully",
        success: true,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .send({ message: "Could not complete the appointment", success: false });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res
        .status(401)
        .send({ message: "No relevant appointment found", success: false });
    
    // else send the notification to the patient
    const newNotification = new Notification({
      userId: appointment.patientId,
      message: "Appointment cancelled",
      type: "warning",
      onclickPath: "/api/users/appointment-cancellation-message",
    });

    const savedNotification = await newNotification.save();
    
    if(!savedNotification) res.status(500).send({ message: "Could not send the notification to the patient", success: false });
    
    const cancelledAppointment = await Appointment.findByIdAndDelete(appointmentId);
    if(!cancelledAppointment) res.status(500).send({ message: "Could not cancel the appointment", success: false });

    
    
    return res.status(200).send({ message: "Appointment cancelled successfully", success: true });

  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Could not cancel the appointment",error:err.message, success: false });
  }
}

const fetchPrescriptionUrl = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    console.log(appointmentId);
    const appointmentObjId = new ObjectId(appointmentId);
    const appointment = await Appointment.findById(appointmentObjId).select(
      "prescriptionUrl"
    );
    if (!appointment)
      return res
        .status(204)
        .send({ message: "Could not find any prescription", success: true });

    return res
      .status(200)
      .send({
        message: "Fetched the prescription successfully",
        prescriptionUrl: appointment.prescriptionUrl,
        success: true,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({
        message: "Could not fetch the prescription",
        err,
        success: false,
      });
  }
};

export {
  fetchLatestAppointmentTimingsPossibleWithFilters,
  bookAppointment,
  fetchAppointmentDetails,
  addPrescriptionAndCompleteAppointment,
  cancelAppointment,
  fetchPrescriptionUrl,
};
