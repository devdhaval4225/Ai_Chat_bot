const User = require("../../model/user.model");


exports.planSubscribe = async (req,res) => {
    try {
        const { deviceId,type, } = req.body;
        let findUserDetails = await User.findOne({
            where: { deviceId: deviceId },
        });

        comst 
        findUserDetails =  findUserDetails.toJSON()
       
    } catch (error) {
        console.log("Error",error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};