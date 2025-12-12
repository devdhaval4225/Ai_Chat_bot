const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { _, pick, omit } = require("lodash")
const { getModelToken } = require("../../config/manageToken");
const Model = require("../../model/aiModel.model");
let threadId = "thread_123"

exports.converzationProvider = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueid
        const body = req.body
        const { deviceId, apiProvider, modelId, message, lastResId } = body
        let conversationsId = body.conversationsId

        const notusedToken = await checkToken(body.deviceId)
        let apiSendUserDetails = pick(notusedToken, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);
        const reminToken = notusedToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            const findModel = await Model.findOne({ where: { modelType: apiProvider, id: Number(modelId) } })
            if (findModel == null) {
                return res.status(400).json({
                    message: "Model Not Found"
                })
            }
            const token = apiSendUserDetails.isSubscribe == 1 ? findModel.dataValues.proToken : findModel.dataValues.token
            const model = apiSendUserDetails.isSubscribe == 1 ? findModel.dataValues.model : findModel.dataValues.model
            const rToken = findModel.dataValues.reduceToken

            let resOpenObj = {
                id: "",
                role: "",
                text: "",
                userDetails: apiSendUserDetails
            }

            if (apiProvider === "openAi") {
                // && conversationsId != ""
                if (!conversationsId) {
                    try {
                        const createConver = await axios({
                            url: 'https://api.openai.com/v1/conversations',
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                // 'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                            data: {
                                "metadata": { "topic": "demo" }
                            }
                        });
                        conversationsId = createConver.data.id

                        const createConversations = await axios({
                            url: 'https://api.openai.com/v1/responses',
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                // 'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                            data: {
                                "model": model, // "gpt-4o-mini",
                                "conversation": conversationsId,
                                "input": message
                            }
                        });
                        await reduceToken(deviceId, uniqueId, apiProvider, "converzation", true, rToken);

                        resOpenObj["id"] = conversationsId
                        resOpenObj["role"] = createConversations.data.output[0]["role"]
                        resOpenObj["text"] = createConversations.data.output[0]["content"][0]["text"]
                        resOpenObj["type"] = createConversations.data.output[0]["content"][0]["type"]
                        resOpenObj["threadId"] = threadId
                        res.status(200).json({
                            data: resOpenObj
                        })

                    } catch (error) {
                        console.log(error.response.data);
                        res.status(500).json({
                            message: "Something went wrong",
                            status: 500
                        })
                    }
                } else {
                    try {
                        if (!conversationsId && conversationsId != "") {
                            res.status(400).json({
                                message: "Conversations Id required"
                            })
                        }
                        let inputBody = {
                            "model": `${model}`,
                            "conversation": { id: conversationsId },
                            "input": message
                        }
                        // lastResId && 
                        if (threadId == null) {
                            await reduceToken(deviceId, uniqueId, apiProvider, "converzationOpenAi", true, rToken);
                        }
                        const createConversations = await axios({
                            url: 'https://api.openai.com/v1/responses',
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            data: inputBody
                        });
                        resOpenObj["id"] = conversationsId
                        resOpenObj["role"] = createConversations.data.output[0]["role"]
                        resOpenObj["text"] = createConversations.data.output[0]["content"][0]["text"]
                        resOpenObj["type"] = createConversations.data.output[0]["content"][0]["type"]
                        resOpenObj["threadId"] = threadId

                        res.status(200).json({
                            data: resOpenObj
                        })
                    } catch (error) {
                        console.log(error.response.data);
                        res.status(500).json({
                            message: "Something went wrong",
                            status: 500
                        })
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};