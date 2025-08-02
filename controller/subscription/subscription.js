const User = require("../../model/user.model");
const Plan = require("../../model/plan.model");
const History = require("../../model/tokenhistory.model");
const Subscription = require("../../model/subscription.model");
const { Op, literal } = require('sequelize');
const moment = require("moment");


exports.planSubscribe = async (req, res) => {
    try {
        const { deviceId, planId, isDown } = req.body;
        await User.hasOne(Plan, {
            foreignKey: 'planSlug',
            sourceKey: 'planType',
            constraints: false
        });
        let findUserDetails = await User.findOne({
            where: { deviceId: deviceId },
            // attributes: ["deviceId","reminToken"],
            include: [
                {
                    model: Plan,
                    required: true,
                    // attributes: ['planId', 'token'],
                    on: literal('users.planType = plan.planSlug')
                }
            ]
        });
        findUserDetails = findUserDetails.toJSON()

        let findPlan
        if (req.body && req.body.planId) {
            findPlan = await Plan.findOne({
                where: { planId: planId, isActive: 1 },
            })
            findPlan = findPlan.toJSON()
        }

        const planUpdateType = req.body && req.body.isDown ? "planDown" : findUserDetails.plan.token < findPlan.token ? "planUpgrade" : "planDown"

        if (planUpdateType === "planUpgrade") {

            if (planId) {
                if (findPlan == null) {
                    res.status(400).json({
                        message: "Plan not found",
                        status: 400
                    })
                } else {
                    const currentDate = moment();
                    const expireDate = moment(findUserDetails.expireDate);
                    const checkDate = expireDate.isAfter(currentDate)

                    if (findUserDetails.reminToken == 0 || !checkDate) {
                        const addDate = currentDate.add(1,findPlan.type)
                        const userTokenUpgrade = await User.update(
                            {
                                reminToken: findUserDetails.reminToken + findPlan.token,
                                totalToken: findUserDetails.totalToken + findPlan.token,
                                isSubscribe:1,
                                expireDate:addDate
                            },
                            { where: { deviceId: deviceId } },
                        )

                        // Create Subscription History
                        await Subscription.create({
                            deviceId: deviceId,
                            currentPlanId: findUserDetails.plan.planId,
                            currentToken: findUserDetails.reminToken,
                            newPlanId: findPlan.planId,
                            newPlanToken: findPlan.token,
                            isUpDown: "up",
                            newRefreshToken: findUserDetails.reminToken + findPlan.token
                        })

                        // Create History 
                        await History.create({
                            apiProvider: "planUpgrade",
                            deviceId: deviceId,
                            totalToken: findUserDetails.totalToken + findPlan.token,
                            usedToken: findUserDetails.usedToken,
                            reminToken: findUserDetails.reminToken + findPlan.token,
                            metadata: "planUpgrade"
                        })
                        res.status(200).json({
                            message: "Plan is Upgrade"
                        })
                    } else {
                        res.status(400).json({
                            message: "Current Plan is Runing"
                        })
                    }
                }
            } else {
                res.status(400).json({
                    message: "Plan is missing"
                })
            }
        }

        if (planUpdateType === "planDown") {
            if (isDown == 1) {
                let findCurrentPlan = await Plan.findOne({
                    where: { planSlug: findUserDetails.planType },
                })
                findCurrentPlan = findCurrentPlan.toJSON()

                if (findCurrentPlan == null) {
                    res.status(400).json({
                        message: "Plan not found",
                        status: 400
                    })
                } else {
                    const avalableToken = findCurrentPlan.token < findUserDetails.reminToken ? findCurrentPlan.token : 0

                    const userTokenUpgrade = await User.update(
                        { reminToken: avalableToken,isSubscribe:0 },
                        { where: { deviceId: deviceId } },
                    );

                    // Create Subscription History
                    await Subscription.create({
                        deviceId: deviceId,
                        currentPlanId: findCurrentPlan.planId,
                        currentToken: findUserDetails.reminToken,
                        newPlanId: 'free-zN8u2k5FC',
                        newPlanToken: 5,
                        isUpDown: "down",
                        newRefreshToken: avalableToken
                    })

                    // Create History 
                    await History.create({
                        apiProvider: "planDown",
                        deviceId: deviceId,
                        totalToken: findUserDetails.totalToken,
                        usedToken: findUserDetails.usedToken,
                        reminToken: avalableToken,
                        metadata: "planDown"
                    })
                    res.status(200).json({
                        message: "Plan is Downgrade"
                    })

                }
            } else {
                res.status(400).json({
                    message: "Plan is not Downgrade"
                })
            }
        }
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};