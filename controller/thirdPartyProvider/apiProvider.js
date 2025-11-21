const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const User = require("../../model/user.model");
const { _, pick, omit } = require("lodash")
const crypto = require("crypto");
const { getToken } = require("../../config/manageToken");
const commonFunction = require("../../common/commonFunction");

exports.provider = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueid
        // const { deviceId } = req.params
        const body = req.body
        const { apiProvider, deviceId } = body

        const notusedToken = await checkToken(body.deviceId)
        let apiSendUserDetails
        let updateUserData
        // let apiSendUserDetails = pick(notusedToken, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);
        const reminToken = notusedToken.reminToken
        if (reminToken == 0 && !(body.filedObj.apiType === "chatCompletion")) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {

            let getMetadata = notusedToken.metadata != null ? JSON.parse(notusedToken.metadata) : {}

            const openAiToken = await getToken('openAi');
            const openAichatCompletionToken = await getToken('openAichatCompletion');
            const mistralAiToken = await getToken('mistralAi');
            const geminiToken = await getToken('gemini');
            const deepSeekToken = await getToken('deepSeek');

            if (apiProvider === "OpenAi") {
                const { threadId, assistant_id, runId, messages, apiType, contents } = body.filedObj
                const getThredId = (getMetadata && getMetadata.openAi) === threadId ? false : true
                if (apiType === "createThread") {
                    try {
                        let createThread = await axios({
                            url: 'https://api.openai.com/v1/threads',
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${notusedToken.isSubscribe == 1 ? openAiToken.subscribe_token : openAiToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            }
                        });
                        const pickThredData = pick(createThread.data, 'id')
                        createThread = pickThredData

                        getMetadata["openAi"] = createThread.id
                        await reduceToken(deviceId, uniqueId, apiProvider, apiType, true)
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
                        // console.log("--error--", error)
                        res.status(400).json({
                            message: error.response.data.error.message
                        })
                    }
                }
                if (apiType === "threadRun") {
                    if (body && body.filedObj && threadId && assistant_id) {
                        if (getThredId) {
                            await reduceToken(deviceId, uniqueId, apiProvider, apiType)
                            getMetadata["openAi"] = threadId
                            await User.update(
                                { metadata: JSON.stringify(getMetadata) },
                                { where: { deviceId: deviceId } }
                            );
                        }
                        try {
                            let createThreadRun = await axios({
                                url: `https://api.openai.com/v1/threads/${threadId}/runs`,
                                method: 'post',
                                headers: {
                                    Authorization: `Bearer ${notusedToken.isSubscribe == 1 ? openAiToken.subscribe_token : openAiToken.token}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    assistant_id: assistant_id
                                }
                            });
                            // console.log("--createThreadRun--",createThreadRun.data)
                            createThreadRun = createThreadRun.data

                            updateUserData = await checkToken(deviceId)
                            createThreadRun["userDetails"] = pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

                            res.status(200).json({
                                data: createThreadRun
                            })
                        } catch (error) {
                            // console.log("Thread Run Error",error);
                            res.status(400).json({
                                message: error.response.data.error.message
                            })
                        }

                    } else {
                        res.status(400).json({
                            message: "Thread and Assistant Id Missing"
                        })
                    }

                }
                if (apiType === "getThreadRunStatus") {

                    if (body && body.filedObj && threadId && runId) {

                        if (getThredId) {
                            await reduceToken(deviceId, uniqueId, apiProvider, apiType)
                            getMetadata["openAi"] = threadId
                            await User.update(
                                { metadata: JSON.stringify(getMetadata) },
                                { where: { deviceId: deviceId } }
                            );
                        }

                        try {
                            let getRunStatus = await axios({
                                url: `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
                                method: 'get',
                                headers: {
                                    Authorization: `Bearer ${notusedToken.isSubscribe == 1 ? openAiToken.subscribe_token : openAiToken.token}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                            });
                            getRunStatus = getRunStatus.data
                            updateUserData = await checkToken(deviceId)
                            getRunStatus["userDetails"] = pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

                            res.status(200).json({
                                data: getRunStatus
                            })
                        } catch (error) {
                            res.status(400).json({
                                message: error.response.data.error.message
                            })
                        }

                    } else {
                        res.status(400).json({
                            message: "Thread and Run Id Missing"
                        })
                    }

                }
                if (apiType === "chatCompletion") {
                    if (getMetadata.openAi !== body.filedObj.threadId) {
                        res.status(400).json({
                            message: "Thread Id Missing"
                        })
                    }
                    if (body && body.filedObj && contents) {


                    for (const item of contents) {
                        const checkStatus = await commonFunction.checkModeration(item.text);
                        if (checkStatus) {
                          return res.status(400).json({
                            message: `A "${item.text}" might refer to content that is explicit, sexual, or involves descriptions of nudity. However, sharing or promoting such text is often inappropriate and may violate community guidelines, moral standards, and even laws in some cases.

If you're using the term in a different context, could you please provide more details to help me better understand what you mean?`
                          });
                        }
                    }
                        const newContents = contents.map(obj => ({
                            ...obj,
                            content: obj.text,
                        }));


                        try {
                            let getRunStatus = await axios({
                                url: `https://api.openai.com/v1/chat/completions`,
                                method: 'post',
                                headers: {
                                    Authorization: `Bearer ${notusedToken.isSubscribe == 1 ? openAichatCompletionToken.subscribe_token : openAichatCompletionToken.token}`,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "model": notusedToken.isSubscribe == 1 ? openAichatCompletionToken.subscribe_model : openAichatCompletionToken.model,
                                    messages: newContents,
                                }
                            });

                            const pickRunStatusData = [
                                {
                                    role: getRunStatus.data.choices[0]["message"]["role"],
                                    text: getRunStatus.data.choices[0]["message"]["content"]
                                }
                            ]
                            updateUserData = await checkToken(deviceId)

                            const chatComRes = {
                                content: pickRunStatusData,
                                userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                            }

                            res.status(200).json({
                                data: chatComRes
                            })
                        } catch (error) {
                            console.log("Chat Completion Error", error.response.data.error.message);
                            res.status(400).json({
                                message: error.response.data.error.message
                            })
                        }

                    } else {
                        res.status(400).json({
                            message: "Messages Missing"
                        })
                    }

                }
            }

            if (apiProvider === "MistralAi") {
                const { apiType, messages, contents } = body.filedObj

                if (apiType === "createThread") {
                    await reduceToken(deviceId, uniqueId, apiProvider, apiType, true)

                    updateUserData = await checkToken(deviceId)
                    const createMistalAi = {
                        id: `mistral_${crypto.randomBytes(10).toString('hex')}`,
                        userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                    }
                    getMetadata["mistralAi"] = createMistalAi.id

                    await User.update(
                        { metadata: JSON.stringify(getMetadata) },
                        { where: { deviceId: deviceId } }
                    );

                    res.status(200).json({
                        data: createMistalAi
                    })
                }

                if (apiType === "chatCompletion") {
                    if (getMetadata.mistralAi !== body.filedObj.threadId) {
                        res.status(400).json({
                            message: "Thread Id Missing"
                        })
                    }

                    for (const item of contents) {
                        const checkStatus = await commonFunction.checkModeration(item.text);
                        if (checkStatus) {
                          return res.status(400).json({
                            message: `A "${item.text}" might refer to content that is explicit, sexual, or involves descriptions of nudity. However, sharing or promoting such text is often inappropriate and may violate community guidelines, moral standards, and even laws in some cases.

If you're using the term in a different context, could you please provide more details to help me better understand what you mean?`
                          });
                        }
                    }

                    const newContents = contents.map(({ text, ...rest }) => ({
                        ...rest,
                        content: text
                    }));

                    try {
                        let chatCompletions = await axios({
                            url: 'https://api.mistral.ai/v1/chat/completions',
                            method: 'post',
                            headers: {
                                'Authorization': `Bearer ${notusedToken.isSubscribe == 1 ? mistralAiToken.subscribe_token : mistralAiToken.token}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            data: {
                                "model": notusedToken.isSubscribe == 1 ? mistralAiToken.subscribe_model : mistralAiToken.model,
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

            if (apiProvider === "Gemini") {
                const { apiType, contents } = body.filedObj

                if (apiType === "createThread") {
                    await reduceToken(deviceId, uniqueId, apiProvider, apiType, true)

                    updateUserData = await checkToken(deviceId)
                    const createGeminiThred = {
                        id: `gemini_${crypto.randomBytes(10).toString('hex')}`,
                        userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                    }

                    getMetadata["geminiId"] = createGeminiThred.id

                    await User.update(
                        { metadata: JSON.stringify(getMetadata) },
                        { where: { deviceId: deviceId } }
                    );

                    res.status(200).json({
                        data: createGeminiThred
                    })
                }


                if (apiType === "chatCompletion") {

                    if (getMetadata.geminiId !== body.filedObj.threadId) {
                        res.status(400).json({
                            message: "Thread Id Missing"
                        })
                    }

                    for (const item of contents) {
                        const checkStatus = await commonFunction.checkModeration(item.text);
                        if (checkStatus) {
                          return res.status(400).json({
                            message: `A "${item.text}" might refer to content that is explicit, sexual, or involves descriptions of nudity. However, sharing or promoting such text is often inappropriate and may violate community guidelines, moral standards, and even laws in some cases.

If you're using the term in a different context, could you please provide more details to help me better understand what you mean?`
                          });
                        }
                    }
                    const createNewArray = contents.map(item => ({
                        role: item.role,
                        parts: [
                            { text: item.text || "" }
                        ]
                    }));

                    try {
                        let chatCompletions = await axios({
                            url: `https://generativelanguage.googleapis.com/v1/models/${notusedToken.isSubscribe == 1 ? geminiToken.subscribe_model : geminiToken.model}:generateContent?key=${notusedToken.isSubscribe == 1 ? geminiToken.subscribe_token : geminiToken.token}`,
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
            }

            if (apiProvider === "deepSeek") {
                const { apiType, contents } = body.filedObj

                if (apiType === "createThread") {
                    await reduceToken(deviceId, uniqueId, apiProvider, apiType, true)

                    updateUserData = await checkToken(deviceId)
                    const createdeepThread = {
                        id: `deepSeek_${crypto.randomBytes(8).toString('hex')}`,
                        userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                    }

                    getMetadata["deepSeekId"] = createdeepThread.id

                    await User.update(
                        { metadata: JSON.stringify(getMetadata) },
                        { where: { deviceId: deviceId } }
                    );

                    res.status(200).json({
                        data: createdeepThread
                    })
                }


                if (apiType === "chatCompletion") {

                    if (getMetadata.deepSeekId !== body.filedObj.threadId) {
                        res.status(400).json({
                            message: "Thread Id Missing"
                        })
                    }

                    for (const item of contents) {
                        const checkStatus = await commonFunction.checkModeration(item.text);
                        if (checkStatus) {
                          return res.status(400).json({
                            message: `A "${item.text}" might refer to content that is explicit, sexual, or involves descriptions of nudity. However, sharing or promoting such text is often inappropriate and may violate community guidelines, moral standards, and even laws in some cases.

If you're using the term in a different context, could you please provide more details to help me better understand what you mean?`
                          });
                        }
                    }

                    const newContents = contents.map(({ text, ...rest }) => ({
                        ...rest,
                        content: text
                    }));

                    try {
                        let chatCompletions = await axios({
                            url: `https://api.deepseek.com/chat/completions`,
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${notusedToken.isSubscribe == 1 ? deepSeekToken.subscribe_token : deepSeekToken.token}`,
                            },
                            data: {
                                "model": notusedToken.isSubscribe == 1 ? deepSeekToken.subscribe_model : deepSeekToken.model,
                                "messages": newContents,
                                "stream": false

                            }
                        });
                        // await reduceToken(deviceId, uniqueId, apiProvider, apiType)

                        chatCompletions = chatCompletions.data.choices.map(msg => ({
                            role: msg.message.role,
                            text: msg.message.content,
                            reasoning_content: msg.message.reasoning_content,
                        }))
                        updateUserData = await checkToken(deviceId)

                        const resChatCompletions = {
                            content: chatCompletions,
                            userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                        }

                        res.status(200).json({
                            data: resChatCompletions
                        })
                    } catch (error) {
                        console.log("--error---", error)
                        res.status(400).json({
                            message: error.response.data.message,
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