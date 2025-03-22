import e from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const router = e.Router();

router.route("/create-order").post(createOrder);

router.route("/verify-payment").post(authenticateToken, verifyPayment);

export default router;