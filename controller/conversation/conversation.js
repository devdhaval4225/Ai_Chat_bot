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
        let updateUserData

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
                content: {},
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

                        resOpenObj["content"]["id"] = conversationsId
                        resOpenObj["content"]["role"] = createConversations.data.output[0]["role"]
                        resOpenObj["content"]["text"] = createConversations.data.output[0]["content"][0]["text"]
                        resOpenObj["content"]["type"] = createConversations.data.output[0]["content"][0]["type"]
                        resOpenObj["content"]["threadId"] = threadId
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
                        resOpenObj["content"]["id"] = conversationsId
                        resOpenObj["content"]["role"] = createConversations.data.output[0]["role"]
                        resOpenObj["content"]["text"] = createConversations.data.output[0]["content"][0]["text"]
                        resOpenObj["content"]["type"] = createConversations.data.output[0]["content"][0]["type"]
                        resOpenObj["content"]["threadId"] = threadId

                        res.status(200).json({
                            data: resOpenObj
                        })
                    } catch (error) {
                        console.log(error.response.data.error.message);
                        res.status(400).json({
                            message: error.response.data.error.message,
                            status: 400
                        })
                    }
                }
            }

            if (apiProvider === "Gemini") {
                if (body.threadId == null || body.threadId == "") {
                    await reduceToken(deviceId, uniqueId, apiProvider, "converzationGemini", true, rToken);
                }

                try {
                    let chatCompletions = await axios({
                        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${token}`,
                        method: 'post',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            contents: createNewArray
                        }
                    });
                    const content = chatCompletions.data.candidates.map(msg => ({
                        role: msg.content.role,
                        text: msg.content.parts.map((v) => v.text).join(",")
                    }))
                    updateUserData = await checkToken(deviceId)

                    const resChatCompletions = {
                        content: content,
                        userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                    }

                    res.status(200).json({
                        data: resChatCompletions
                    })
                } catch (error) {
                    if (error.response.data.error.code === 503) {
                        res.status(503).json({
                            message: "The model is overloaded. Please try again later.",
                        })
                    } else if (error.response.data.error.code === 404) {
                        res.status(400).json({
                            message: error.response.data.error.message,
                        })
                    } else {
                        res.status(400).json({
                            message: error.response.data.error.message,
                        })
                    }
                }

            }

            if (apiProvider === "MistralAi") {
                    if (body.threadId == null || body.threadId == "") {
                        await reduceToken(deviceId, uniqueId, apiProvider, "converzationMistralAi", true, rToken);
                    }

                    try {
                        let chatCompletions = await axios({
                            url: 'https://api.mistral.ai/v1/chat/completions',
                            method: 'post',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            data: {
                                "model": model,
                                "messages": newContents,
                                "temperature": 0.7,
                                "max_tokens": 256
                            }
                        });
                        const contentRes = chatCompletions.data.choices.map(msg => ({ role: msg.message.role, text: msg.message.content }))
                        updateUserData = await checkToken(deviceId)

                        const mistralRes = {
                            content: contentRes,
                            userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']),
                        }

                        res.status(200).json({
                            data: mistralRes
                        })
                    } catch (error) {
                        console.log("---error--", error.response.data)
                        res.status(400).json({
                            message: error.response.data.message,
                        })
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