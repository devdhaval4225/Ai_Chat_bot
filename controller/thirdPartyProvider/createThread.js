const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const User = require("../../model/user.model");
const { pick } = require("lodash");
const { getModelToken } = require("../../config/manageToken");


exports.createThread = async (req, res) => {
    try {
        const { deviceId, } = req.body;
        const uniqueId = req.headers.uniqueid
        const notusedToken = await checkToken(deviceId)
        const openAiToken = await getModelToken("openAi");
        try {

            let createThread = await axios({
                url: 'https://api.openai.com/v1/threads',
                method: 'post',
                headers: {
                    Authorization: `Bearer ${notusedToken.isSubscribe == 1 ? openAiToken.proToken : openAiToken.token}`,
                    'OpenAI-Beta': 'assistants=v2',
                    'Content-Type': 'application/json'
                }
            });
            const pickThredData = pick(createThread.data, 'id')
            createThread = pickThredData

            let getMetadata = notusedToken.metadata != null ? JSON.parse(notusedToken.metadata) : {}
            getMetadata["openAi"] = createThread.id
            await reduceToken(deviceId, uniqueId, "OpenAi", "createThread", true)
            updateUserData = await checkToken(deviceId)
            createThread["userDetails"] = pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

            await User.update(
                { metadata: JSON.stringify(getMetadata) },
                { where: { deviceId: deviceId } }
            );

            res.status(200).json({
                data: createThread
            })
        } catch (error) {
            console.log("--error--", error)
            res.status(400).json({
                message: error.response.data.error.message
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
}