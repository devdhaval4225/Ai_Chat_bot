const User = require("../model/user.model");
const History = require("../model/tokenhistory.model");
const { Sequelize, QueryTypes } = require('sequelize');
const CryptoJS = require("crypto-js");
const moment = require("moment");

exports.reduceToken = async (deviceId, uniqueId, apiProvider, apiUseType, isThred = false) => {
    try {
        const findUser = await this.checkToken(deviceId);
        const userUniqueId = findUser.uniqueId
        if (!isThred && userUniqueId === uniqueId) {
            return;
        } else {
            const updatedUniqueId = isThred === true ? userUniqueId : uniqueId
            const isSuborNot = (findUser.reminToken - 1) == 0 ? 0 : findUser.isSubscribe
            const expDate = (findUser.reminToken - 1) == 0 ? null : findUser.expireDate

            const currentDate = moment();
            const expireDate = moment(findUser.expireDate);
            const checkDate = expireDate.isAfter(currentDate)

            const newTokenData = await User.update(
                {
                    reminToken: Sequelize.literal('reminToken - 1'),
                    usedToken: Sequelize.literal('usedToken + 1'),
                    isSubscribe: checkDate ? findUser.isSubscribe : 0,
                    expireDate: expDate,
                    uniqueId: updatedUniqueId,
                    planType: checkDate ? findUser.planType : "Free-Plan",
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
                apiUseType: apiUseType,
                totalToken: findTestToken.totalToken,
                usedToken: findTestToken.usedToken,
                reminToken: findTestToken.reminToken
            })
        }
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

exports.encrypt = async (text) => {
    const ciphertext = await CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
    return ciphertext;
};

exports.decrypt = async (text) => {
    const bytes = await CryptoJS.AES.decrypt(text, process.env.SECRET_KEY);
    const originalText = await bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};