const TokenModel = require("../model/manageToken.model");
const Model = require("../model/aiModel.model");

async function getToken(key) {
    let config = await TokenModel.findAll();
    const findKey = config.find((v) => v.type == key).dataValues
    return findKey;
}

async function getModelToken(type, model) {
    let config = !model ? await Model.findOne({ where: { modelType: type } }) : await Model.findOne({ where: { modelType: type, model: model } })
    return { token: config.dataValues.token, proToken: config.dataValues.proToken };
}


module.exports = { getToken, getModelToken };