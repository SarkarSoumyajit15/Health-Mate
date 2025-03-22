import mongoose,{Schema} from "mongoose";




const notificationSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error','action'],
        default: 'info'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isSeen: {
        type: Boolean,
        default: false
    },
    onclickPath: {
        type: String,
        default: '',
    },
    dataToBeSentOnClick: {
        type: Schema.Types.Mixed,
        default: {}
    },
    actionAcceptPath: {
        type: String,
        default: '',
    },
    actionRejectPath: {
        type: String,
        default: '',
    },
    dataToBeSentOnActionAccept: {
        type: Schema.Types.Mixed,
        default: {}
    },
    dataToBeSentOnActionReject: {
        type: Schema.Types.Mixed,
        default: {}
    },

});

const Notification = mongoose.model('notifications', notificationSchema);

export default Notification;