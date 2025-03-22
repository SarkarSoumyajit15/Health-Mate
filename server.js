import e from 'express'
import dotenv from 'dotenv';
import connectDB from './config/DBConnect.js';
import userRoute from './routes/userRoutes.js';
import doctorRoute from './routes/doctorRoutes.js';
import testRoute from './routes/testRoute.js';
import paymentRoute from './routes/paymentRoute.js';
import appointmentRoute from './routes/appointmentRoute.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import rateLimiterMiddleware from './middleware/rateLimiter.js';
import { normalLimiter , signinLimiter } from './middleware/rateLimiter.js';

dotenv.config();

connectDB();





const app = e();
app.use(e.json({limit: "16kb"}));
app.use(e.urlencoded({extended: true, limit: "16kb"}))


const allowedOrigins = process.env.CORS_ORIGIN.split(',');

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
    credentials: true,
    preflightContinue: false,
    maxAge:600,

};

app.use(cors(corsOptions)); 



// app.use(cors(
//     {
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
//     }
// ));

app.use(cookieParser());

// app.use(express.json({limit: "16kb"}))

app.use('/api/users/login',rateLimiterMiddleware(signinLimiter));

app.use(rateLimiterMiddleware(normalLimiter));


const port = process.env.PORT || 3002

app.listen(port,()=>{console.log(`server is listening on port ${port}`)});

// User routes :
app.use('/api/users',userRoute); 

app.use('/api/doctors',doctorRoute);

app.use('/api/appointments',appointmentRoute);

app.use('/api/payment',paymentRoute);

app.use('/api/testing',testRoute);

