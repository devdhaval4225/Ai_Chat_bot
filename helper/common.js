const User = require("../model/user.model");
const History = require("../model/tokenhistory.model");
const { Sequelize, QueryTypes } = require('sequelize');
const CryptoJS = require("crypto-js");

exports.reduceToken = async (deviceId, uniqueId, apiProvider, apiUseType) => {
    try {
        const findUser = await this.checkToken(deviceId);
        const userUniqueId = findUser.uniqueId
        if(userUniqueId === uniqueId) {
            return;
        } else {
            const newTokenData = await User.update(
                {
                    reminToken: Sequelize.literal('reminToken - 1'),
                    useToken: Sequelize.literal('useToken + 1'),
                    uniqueId:uniqueId
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
    const bytes  = await CryptoJS.AES.decrypt(text, process.env.SECRET_KEY);
    const originalText = await bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};