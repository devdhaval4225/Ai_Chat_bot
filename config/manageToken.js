const TokenModel = require("../model/manageToken.model");

async function getToken(key) {
    let config = await TokenModel.findAll();
    config = config.map((v) => { return { model: v.model, token: v.token, type: v.type, metadata: v.metadata}})
    const findKey = config.find((v) => v.type == key)
    return findKey;
}


module.exports = { getToken };