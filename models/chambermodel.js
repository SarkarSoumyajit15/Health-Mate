import mongoose, { Schema } from "mongoose";

const chamberSchema = new mongoose.Schema({
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'doctors',
      required: true,
    },
    weekday: {
      type: Number, // E.g., 'Monday', 'Tuesday', etc.
      required: true,
    },
    startTime: {
      type: Object, // The start time of availability on a specific day
      required: true,
    },
    endTime: {
      type: Object, // The end time of availability on a specific day
      required: true,
    },
    totalNumberOfAppointments: {
      type: Number, // The total number of appointments that can be scheduled on a specific day
      required: true,
    },
    currentNumberOfAppointments: {
      type: Number, // The current number of appointments that have been scheduled on a specific day
      default: 0,
    },
    nextAppointmentSlotStartTime: {
      type: Object, // The start time of the next available appointment slot
      required: true,
    },
    chamberLocation:{
      addressLine1:{
        type:String,
        required:true,
      },
      addressLine2:{
        type:String,
        required:true,
      },
      city:{
        type:String,
        required:true,
      },
      state:{
        type:String,
        required:true,
      },
    },
    durationInMinutes:{
      type:Number,
      required:true
    },
  });



  // chamberSchema.post('save', async function (chamber, next) {
  //   try {
  //     // Get the duration of each appointment
  //     const { durationInMinutes, nextAppointmentSlotStartTime, endTime, startTime, weekday } = chamber;
  
  //     // Calculate the new nextAppointmentSlotStartTime by adding duration
  //     let updatedSlotStartTime = new Date(nextAppointmentSlotStartTime);
  //     updatedSlotStartTime.setMinutes(updatedSlotStartTime.getMinutes() + durationInMinutes);
  
  //     // If the updatedSlotStartTime exceeds the endTime for the day, move to the next week
  //     if (updatedSlotStartTime > endTime) {
  //       // Move to the next week's same weekday
  //       const daysToNextWeek = 7; // Jump to the same day of the next week
  //       let nextWeekStartTime = new Date(startTime);
  //       let nextWeekEndTime = new Date(endTime);
  
  //       nextWeekStartTime.setDate(nextWeekStartTime.getDate() + daysToNextWeek);
  //       nextWeekEndTime.setDate(nextWeekEndTime.getDate() + daysToNextWeek);
  
  //       // Set next appointment slot to the start time of the next week's same day
  //       chamber.nextAppointmentSlotStartTime = nextWeekStartTime;
  //       chamber.startTime = nextWeekStartTime;
  //       chamber.endTime = nextWeekEndTime;
  //     } else {
  //       // If still within today's slots, just update the nextAppointmentSlotStartTime
  //       chamber.nextAppointmentSlotStartTime = updatedSlotStartTime;
  //     }
  
  //     // Save the updated chamber
  //     await chamber.save();
  //     next();
  //   } catch (error) {
  //     next(error);
  //   }
  // });
  
const Chamber = mongoose.model('chambers', chamberSchema);

export default Chamber;
  