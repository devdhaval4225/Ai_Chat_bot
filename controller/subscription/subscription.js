const User = require("../../model/user.model");


exports.planSubscribe = async (req,res) => {
    try {
        const { deviceId,type, } = req.body;

       
    } catch (error) {
        console.log("User Check Error",error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
};