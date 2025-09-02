const User = require("../../model/user.model");
const History = require("../../model/tokenhistory.model");
const Subscription = require("../../model/subscription.model");
const Plan = require("../../model/plan.model");
const shortid = require('shortid');
const moment = require("moment");
const { Op, fn, col, where, literal } = require("sequelize");
const { checkToken } = require("../../helper/common");


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

            if (findUser.planType === "Free-Plan" && findUser.reminToken == 0) {
                const dailyLimit = process.env.DAILY_LIMIT

                const lastEntry = await History.findAll({
                    where: {
                        deviceId: deviceId,
                        apiProvider: "dailyLimit",
                        [Op.and]: where(fn("DATE", col("useDateTime")), fn("CURDATE")),
                    },
                    order: [["id", "DESC"]],
                });
                if (!lastEntry.length > 0) {

                    await User.hasOne(Plan, {
                        foreignKey: 'planSlug',
                        sourceKey: 'planType',
                        constraints: false
                    });
                    let findUserDetails = await User.findOne({
                        where: { deviceId: deviceId },
                        include: [
                            {
                                model: Plan,
                                required: true,
                                on: literal('users.planType = plan.planSlug')
                            }
                        ]
                    });
                    findUserDetails = findUserDetails.toJSON()

                    // Find Plan
                    let findPlan = await Plan.findOne({
                        where: { planId: `daily-L!M!T`, isActive: 1 },
                    })
                    findPlan = findPlan.toJSON()

                    // Create History 
                    await History.create({
                        apiProvider: "dailyLimit",
                        deviceId: deviceId,
                        totalToken: Number(findUser.totalToken) + Number(dailyLimit),
                        usedToken: findUser.usedToken,
                        reminToken: dailyLimit,
                        metadata: "dailyLimit"
                    })

                    // Create Subscription History
                    await Subscription.create({
                        deviceId: deviceId,
                        currentPlanId: findUserDetails.plan.planId,
                        currentToken: findUserDetails.reminToken,
                        newPlanId: findPlan.planId,
                        newPlanToken: findPlan.token,
                        isUpDown: "daliy",
                        newRefreshToken: findPlan.token
                    })

                    await User.update(
                        {
                            totalToken: Number(findUser.totalToken) + Number(findPlan.token),
                            reminToken: dailyLimit,
                        },
                        { where: { deviceId: deviceId } },
                    )

                    const dailyFreshUserDetails = await checkToken(deviceId);
                    return res.status(200).json({
                        data: dailyFreshUserDetails
                    });
                } else {
                    return res.status(200).json({
                        data: findUser.toJSON()
                    });
                }
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