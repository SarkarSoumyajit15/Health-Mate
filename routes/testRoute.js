
import e from 'express';
import User from '../models/usermodel.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = e.Router();

router.post('/timing-test',authenticateToken, async(req, res) => {
    try {
        const reqBody = req.body;

        const demouser = req.user;

        const {firstname,lastname,specialization,phoneNumber,address,feePerConsultation,allTimings} = reqBody;

  


        const user = await User.findById(demouser.id);
        if (!user) return res.status(401).send({ message: "User does not exist", success: false });

        console.log(allTimings);

        if(!allTimings[0].toTime) return res.status(401).send({ message: "ToTime field is missing man", success: false });
        
        
        const toTime = allTimings[0].toTime;
        // const toTimeParsed =  Date.parse(toTime);
        // const toTimeDated =  new Date(toTimeParsed);
        // console.log("ToTimeParsed :: ",toTimeDated);
        // console.log("Type of all timings.toTimeDated field  :: ",typeof(toTimeDated));

        // console.log(toTimeDated.getHours()+":"+toTimeDated.getMinutes()+":"+toTimeDated.getSeconds());
        // const addedTime = toTimeDated.setMinutes(allTimings[0].durationInMinutes);
        // const addedTimeDated = new Date(addedTime);
        // // const addedTime = toTimeDated.setMinutes(toTimeDated.getMinutes() + allTimings[0].durationInMinutes);
        // console.log("Added Time :: ",addedTimeDated.getHours()+":"+addedTimeDated.getMinutes()+":"+addedTimeDated.getSeconds());

        const fromTime = allTimings[0].fromTime;

        const toTimeParsed =  Date.parse(toTime);
        const fromTimeParsed =  Date.parse(fromTime);

        const toTimeDated =  new Date(toTimeParsed);
        

        const totalDuration = toTimeParsed - fromTimeParsed;
        const appointments = Math.floor(totalDuration / (allTimings[0].durationInMinutes*60000));
        console.log(appointments);



        return res.status(200).send({
            message: "Testing successfully",
            dataToBeDisplayed: { message: ` Just Testing man ` },
            success: true,
        });

    } catch (err) {
        return res.status(401).send({ message: "Could not Test easiy ", success: false });
    }   
}
);

router.route('/check-limiter').get(async(req,res)=>{
    return res.status(200).send({
        message: " response is sent successfully",
        dataToBeDisplayed: { message: ` Just Testing   rate-limiter ` },
        success: true,
    });
})

export default router;
