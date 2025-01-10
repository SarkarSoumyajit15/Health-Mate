import mongoose, { Schema } from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    history: [
      {
        appointmentId: {
          type: Schema.Types.ObjectId,
          ref: "appointments",
        },
        title: {
          type: String,
          required: true,
        },
        date: {
          type: Object,
          required: true,
        },
        prescriptionUrl: {
          type: String,
          default: null,
        },
      },
    ],
    feePerConsultation: {
      type: Number,
      required: true,
    },
    profileimage: {
      type: String,
      default: "",
    },
    chamberLocations: [
      {
        addressLine1: {
          type: String,
          required: true,
        },
        addressLine2: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("doctors", doctorSchema);

export default Doctor;
