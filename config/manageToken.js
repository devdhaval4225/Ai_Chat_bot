const TokenModel = require("../model/manageToken.model");
const Model = require("../model/aiModel.model");
const Ass = require("../model/assistanceModel");

async function getToken(key) {
    let config = await TokenModel.findAll();
    const findKey = config.find((v) => v.type == key).dataValues
    return findKey;
}

async function getModelToken(type, model) {
    let config = !model ? await Model.findOne({ where: { modelType: type } }) : await Model.findOne({ where: { modelType: type, model: model } })
    return { token: config.dataValues.token, proToken: config.dataValues.proToken };
}

async function getAssToken(hashId) {
    let config = await Ass.findOne({ where: { hashId: hashId } })
    return { reduceToken: config.dataValues.reduceToken, name: config.dataValues.nameAssistant };
}


module.exports = { getToken, getModelToken, getAssToken };