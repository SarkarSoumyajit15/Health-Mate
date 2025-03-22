import Razorpay from "razorpay";
import crypto from "crypto";


const createOrder = async (req, res) => {
    try {
        // console.log("Creating order");
        const reqBody = await req.body;
        const {bookingCharges} = reqBody;
        // now create a razorpay instance
        const instance = new Razorpay({
            key_id: process.env.RAZORPAYx_KEY_ID,
            key_secret: process.env.RAZORPAYx_KEY_SECRET
        });

        
        // create an order

        const newOrder = await instance.orders.create({
            amount:bookingCharges * 100,
            currency:"INR"
        });

        // send the order to the frontend
        return res.status(200).send(
            {
            message:"Order created successfully",
            newOrder,
            success:true
            }
        );

        // return response;
    } catch (err) {
        return res.status(500).send(
            {
                message:"Server Error while creating order",
                err,
                success:false
            }
        )
    }
}


const generatedSignature = (
  razorpayOrderId,
  razorpayPaymentId
) => {
  const keySecret = process.env.RAZORPAYx_KEY_SECRET;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");
  return sig;
};

const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpayPaymentId, razorpaySignature } = await req.body;
    
      const signature = generatedSignature(orderId, razorpayPaymentId);
      if (signature !== razorpaySignature) {
        return res.status(400).send({
          message: "Payment verification failed",
          success: false,
        });
      }
    
      return res.status(200).send({
        message: "Payment verified",
        success: true,
      }
      );
    } catch (err) {
        console.log(err);
        return res.status(500).send(
            {
                message:"Server Error while verifying payment",
                err,
                success:false
            }
        )
    }
}

export{
    createOrder,
    verifyPayment,
}