const User = require("../model/user.model");
const History = require("../model/tokenhistory.model");
const { Sequelize, QueryTypes } = require('sequelize');

exports.reduceToken = async (deviceId, apiProvider, apiUseType) => {
    try {
        const newTokenData = await User.update(
            {
                reminToken: Sequelize.literal('reminToken - 1'),
                useToken: Sequelize.literal('useToken + 1')
            },
            {
                where: {
                    reminToken: { [Sequelize.Op.ne]: 0 },
                    deviceId: deviceId
                }
            }
        );
        const findTestToken = await this.checkToken(deviceId);

        await History.create({
            deviceId: deviceId,
            apiProvider: apiProvider,
            apiUseType:apiUseType,
            totalToken:findTestToken.totalToken,
            useToken:findTestToken.useToken,
            reminToken:findTestToken.reminToken
        })


    } catch (error) {
        console.log("---error---", error);
    }
}
exports.checkToken = async (deviceId) => {
    try {
        let findTokenDetails = await User.findOne({
            where: { deviceId: deviceId },
        });
        return findTokenDetails.toJSON()

    } catch (error) {
        console.log("---error---", error);
    }
}