const TokenModel = require("../model/manageToken.model");

async function getToken(key) {
    let config = await TokenModel.findAll();
    const findKey = config.find((v) => v.type == key).dataValues
    return findKey;
}


module.exports = { getToken };