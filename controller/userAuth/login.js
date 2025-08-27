const User = require("../../model/user.model");
const shortid = require('shortid');
const moment = require("moment");


exports.login = async (req, res) => {
    try {

        const { deviceId } = req.body;

        let findUser = await User.findOne({
            where: { deviceId: deviceId }
        });
        if (findUser == null) {
            const createUser = await User.create({ deviceId: deviceId, uniqueId: `UN${shortid.generate()}`, totalToken: 5, reminToken: 5, planType: "Free-Plan" });
            findUser = await User.findOne({
                where: { deviceId: deviceId }
            });
            const findRes = findUser.toJSON()
            res.status(201).json({
                data: findRes
            })
        } else {
            const currentDate = moment();
            if (findUser.expireDate != null) {
                const expireDate = moment(findUser.expireDate);
                const checkDate = expireDate.isAfter(currentDate)
                await User.update(
                    {
                        isSubscribe: checkDate ? findUser.isSubscribe : 0,
                        expireDate: checkDate ? findUser.expireDate : null,
                        planType: checkDate ? findUser.planType : "Free-Plan"
                    },
                    { where: { deviceId: deviceId } },
                )

            }
            res.status(200).json({
                data: findUser.toJSON()
            })
        }
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};