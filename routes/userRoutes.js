import e from "express";

const router = e.Router()

import { acceptCandidate, applyDoctor, appointmentCancellationMessage, deleteAllNotifications, deleteNotification, doctorApplicationApprovalMessage, doctorApplicationDetails, doctorApplicationRejectionMessage, editUserDetails, fetchSeenNotifications, fetchUnseenNotifications, fetchUserDetails, fetchUserHistory, loginUser, logoutUser, markNotificationAsSeen, registerUser, rejectCandidate,  uploadProfileImage } from "../controllers/userController.js";
import authenticateToken, { authenticateAdmin } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";





router.route('/signup').post(registerUser);

router.route('/login').post(loginUser);

router.route('/fetchUserDetails').get(authenticateToken,fetchUserDetails);

router.route('/apply-doctor').post(authenticateToken,applyDoctor);

router.route('/mark-notification-as-seen').post(authenticateToken,markNotificationAsSeen);

router.route('/delete-notification').post(authenticateToken,deleteNotification);

router.route('/delete-all-notifications').post(authenticateToken,deleteAllNotifications);

router.route('/doctor-application-details').post(authenticateToken,authenticateAdmin,doctorApplicationDetails);

router.route('/fetchUnseenNotifications').get(authenticateToken,fetchUnseenNotifications);

router.route('/fetchSeenNotifications').get(authenticateToken,fetchSeenNotifications);

router.route('/accept-candidate').post(authenticateToken,authenticateAdmin,acceptCandidate);

router.route('/reject-candidate').post(authenticateToken,authenticateAdmin,rejectCandidate);

router.route('/doctor-application-rejection-message').post(authenticateToken,doctorApplicationRejectionMessage);

router.route('/doctor-application-approval-message').post(authenticateToken,doctorApplicationApprovalMessage);

router.route('/edit-profile-image').post(authenticateToken,upload.single('profileImage'),uploadProfileImage);

router.route('/edit-user-details').post(authenticateToken,editUserDetails);

router.route('/fetch-history').get(authenticateToken,fetchUserHistory);

router.route('/appointment-cancellation-message').post(authenticateToken,appointmentCancellationMessage);
    

router.route('/logout').post(authenticateToken,logoutUser);




export default router;