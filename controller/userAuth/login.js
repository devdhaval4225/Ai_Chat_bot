const User = require("../../model/user.model");


exports.login = async (req,res) => {
    try {
        const { deviceId } = req.body;

        let findUser = await User.findOne({ 
            where: {deviceId: deviceId}
        });
        if(findUser == null) {
            const createUser = await User.create({ deviceId: deviceId, totalToken:5, reminToken:5, planType:"free" });
            findUser = await User.findOne({ 
                where: {deviceId: deviceId}
            });
            const findRes = findUser.toJSON()
            res.status(201).json({
                data:findRes
            })
        } else {
            res.status(200).json({
                data:findUser.toJSON()
            })
        }        
    } catch (error) {
        console.log("User Check Error",error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
};