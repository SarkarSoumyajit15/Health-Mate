import mongoose, { Schema } from "mongoose";


const appointmentSchema = new mongoose.Schema({
    doctorId:{
        type:Schema.Types.ObjectId,
        ref:'doctors',
        required:true,
    },
    patientId:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true,
    },
    appointmentDate:{
        type:Object,
        required:true,
    },
    status:{
        type:String,
        enum: ['Booked','Completed','Cancelled'],
        required:true,
    },
    prescriptionUrl:{
        type:String,
        default:null,
    },
    documents:[{
      type:Object,
      default:null,
    }],
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
},
{
    timestamps:true,
}
);

const Appointment = mongoose.model("appointments",appointmentSchema);

export default Appointment;