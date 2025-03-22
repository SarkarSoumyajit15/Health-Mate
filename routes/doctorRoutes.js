import e from "express";
// import { get } from "mongoose";
import { editDoctorInfo, fetchDoctorHistory, fetchDoctorInfo,  getAllChambers, getCurrentAppointments, getEligibleDoctorsWithFilter, rejectEditDoctorInfo, requestForEditDoctorInfo, showEditDoctorDetails, showEditDoctorInfoRejectionMessage, showEditDoctorInfoSuccessMessage } from "../controllers/doctorControllers.js";
import authenticateToken, { authenticateAdmin } from "../middleware/authMiddleware.js";
const router = e.Router();

router.route('/get-eligible-doctors-with-filter').get(authenticateToken , getEligibleDoctorsWithFilter);

router.route('/get-all-chambers').get(authenticateToken,getAllChambers);

router.route('/get-all-appointments-today').get(getCurrentAppointments);

router.route('/fetch-history').get(authenticateToken,fetchDoctorHistory);

router.route('/get-doctor-info').get(authenticateToken,fetchDoctorInfo);

router.route('/request-for-edit-doctor-info').post(authenticateToken , requestForEditDoctorInfo);

router.route('/show-edit-doctor-details').post(authenticateToken , showEditDoctorDetails);

router.route('/reject-edit-doctor-info').post(authenticateToken , authenticateAdmin , rejectEditDoctorInfo);

router.route('/show-edit-doctor-info-rejection-message').post(authenticateToken , showEditDoctorInfoRejectionMessage);

router.route('/edit-doctor-info').post(authenticateToken,editDoctorInfo);

router.route('/show-edit-doctor-info-success-message').post(authenticateToken , showEditDoctorInfoSuccessMessage);






export default router;
