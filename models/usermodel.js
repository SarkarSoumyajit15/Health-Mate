import mongoose, { Schema } from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required: true,
    },
    password:{
        type : String,
        required: true,
    },
    email:{
        type : String,
        unique : true,
        required: true,
    },
    profileImage : {
        type : String,
    },
    isVerified:{
        type : Boolean,
        default : false,
    },
    isAdmin:{
        type : Boolean,
        default : false,
    },
    isDoctor :{
        type : Boolean,
        default : false,
    },
    history:[{
        appointmentId:{
            type:Schema.Types.ObjectId,
            ref:'appointments',
        },
        title:{
            type:String,
            required:true,
        },
        date:{
            type:Object,
            required:true,
        },
        prescriptionUrl:{
            type:String,
            default:null,
        },
    }],
    notifications:[{
        type: Schema.Types.ObjectId,
        ref: 'notifications'
    }],
    forgotPasswordToken : {type :String},
    forgotPasswordExpiryDate : {type : Date},
    verifyToken : {type : String},
    verifyTokenExpiryDate : {type : Date},
})

const User = mongoose.model("users",userSchema);

export default User;