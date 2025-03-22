import e from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {  addPrescriptionAndCompleteAppointment, bookAppointment, cancelAppointment, fetchAppointmentDetails, fetchLatestAppointmentTimingsPossibleWithFilters, fetchPrescriptionUrl } from '../controllers/appointmentController.js';
import { upload } from '../middleware/multerMiddleware.js';
const router = e.Router();

router.route('/fetch-latest-appointment-timings-possible-with-filters').post(authenticateToken,fetchLatestAppointmentTimingsPossibleWithFilters);

router.route('/book-appointment').post(authenticateToken,upload.array("files",10),bookAppointment);

router.route('/fetch-appointment-details').post(authenticateToken,fetchAppointmentDetails);

// router.route('/add-prescription').post(authenticateToken,upload.single("prescriptionPDF"),addPrescription);

router.route('/complete-appointment').post(authenticateToken,upload.single("prescriptionPDF"),addPrescriptionAndCompleteAppointment);

router.route('/fetch-prescription-url').get(authenticateToken,fetchPrescriptionUrl);

router.route('/cancel-appointment').post(authenticateToken,cancelAppointment);

export default router;