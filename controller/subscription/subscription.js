const User = require("../../model/user.model");
const Plan = require("../../model/plan.model");
const History = require("../../model/tokenhistory.model");
const Subscription = require("../../model/subscription.model");


exports.planSubscribe = async (req, res) => {
    try {
        const { deviceId, planId, type } = req.body;
        let findUserDetails = await User.findOne({
            where: { deviceId: deviceId },
            include: [
                {
                    model: Plan,
                    required: true,
                    attributes: ['planId as currentPlanId']
                }
            ]
        });
        findUserDetails = findUserDetails.toJSON()

        if (planUpgrade === "planUpgrade") {
            let findPlan = await Plan.findOne({
                where: { planId: planId, isActive: 1 },
            })
            findPlan = findPlan.toJSON()

            if (findPlan == null) {
                res.status(400).json({
                    message: "Plan not found",
                    status: 400
                })
            } else {
                const userTokenUpgrade = await User.update(
                    { reminToken: findUserDetails + findPlan.token },
                    { where: { deviceId: deviceId } },
                )

                // Create Subscription History
                await Subscription.create({
                    deviceId: deviceId,
                    currentPlanId: findUserDetails.currentPlanId,
                    currentToken: findUserDetails.reminToken,
                    newPlanId: findPlan.planId,
                    newPlanToken: findPlan.token,
                    isUpDown: "up",
                    newRefreshToken: findUserDetails.reminToken + findPlan.token
                })

                // Create History 
                await History.create({
                    deviceId: deviceId,
                    totalToken: findUserDetails.totalToken + findPlan.token,
                    usedToken: findUserDetails.usedToken,
                    reminToken: findTestToken.reminToken,
                    metadata: "planUpgrade"
                })
            }
        }

        if (planUpgrade === "planDown") {
            let findCurrentPlan = await Plan.findOne({
                where: { planSlug: findUserDetails.planType},
            })
            findCurrentPlan = findCurrentPlan.toJSON()

            if(findPlan == null){
                res.status(400).json({
                    message: "Plan not found",
                    status: 400
                })
            } else {
                const avalableToken = findUserDetails.reminToken > findCurrentPlan.token ? findCurrentPlan.token : 0

                const userTokenUpgrade = await User.update(
                    { reminToken: avalableToken },
                    { where: { deviceId: deviceId } },
                );

                // Create Subscription History
                await Subscription.create({
                    deviceId: deviceId,
                    currentPlanId: findCurrentPlan.planId,
                    currentToken: findUserDetails.reminToken,
                    newPlanId: null,
                    newPlanToken: null,
                    isUpDown: "down",
                    newRefreshToken: avalableToken
                })

                // Create History 
                await History.create({
                    deviceId: deviceId,
                    totalToken: findUserDetails.totalToken,
                    usedToken: findUserDetails.usedToken,
                    reminToken: avalableToken,
                    metadata: "planDown"
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