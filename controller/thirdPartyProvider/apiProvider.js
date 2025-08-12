const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const User = require("../../model/user.model");
const { _, pick } = require("lodash")

exports.provider = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueId
        // const { deviceId } = req.params
        const body = req.body
        const { apiProvider, deviceId } = body

        const notusedToken = await checkToken(body.deviceId)
        const apiSendUserDetails = pick(notusedToken, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);
        const reminToken = notusedToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            if (apiProvider === "OpenAi") {
                const { threadId, assistant_id, runId, messages, apiType, contents } = body.filedObj
                let getMetadata = notusedToken.metadata != null ? JSON.parse(notusedToken.metadata) : {}
                const getThredId = (getMetadata && getMetadata.filedObj && getMetadata.filedObj.threadId) === threadId ? false : true
                if (apiType === "createThread") {
                    try {
                        let createThread = await axios({
                            url: 'https://api.openai.com/v1/threads',
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            }
                        });
                        const pickThredData = pick(createThread.data, 'id')
                        createThread = pickThredData

                        createThread["userDetails"] = apiSendUserDetails

                        getMetadata["openAi"] = createThread.id
                        await reduceToken(deviceId, uniqueId, apiProvider, apiType)
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
                            message: "Openai Create Thread Erorr"
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
                                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    assistant_id: assistant_id
                                }
                            });
                            // console.log("--createThreadRun--",createThreadRun.data)
                            createThreadRun = createThreadRun.data
                            createThreadRun["userDetails"] = apiSendUserDetails


                            res.status(200).json({
                                data: createThreadRun
                            })
                        } catch (error) {
                            // console.log("Thread Run Error",error);
                            res.status(400).json({
                                message: "Thread Run Error"
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
                                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                            });
                            getRunStatus = getRunStatus.data
                            getRunStatus["userDetails"] = apiSendUserDetails

                            res.status(200).json({
                                data: getRunStatus
                            })
                        } catch (error) {
                            res.status(400).json({
                                message: "Get Thread Run Error"
                            })
                        }

                    } else {
                        res.status(400).json({
                            message: "Thread and Run Id Missing"
                        })
                    }

                }
                if (apiType === "chatCompletion") {
                    await reduceToken(deviceId, uniqueId, apiProvider, apiType)
                    if (body && body.filedObj && contents) {
                        try {
                            let getRunStatus = await axios({
                                url: `https://api.openai.com/v1/chat/completions`,
                                method: 'post',
                                headers: {
                                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                    'Content-Type': 'application/json'
                                },
                                data: {
                                    "model": "gpt-4o",
                                    messages: contents
                                }
                            });

                            const pickRunStatusData = pick(getRunStatus.data, ['id', 'created', 'choices'])
                            pickRunStatusData.choices = pickRunStatusData.choices.map(choice => ({ message: pick(choice.message, ['role', 'content']), index: choice.index }));
                            getRunStatus = pickRunStatusData
                            getRunStatus["userDetails"] = apiSendUserDetails

                            res.status(200).json({
                                data: getRunStatus
                            })
                        } catch (error) {
                            console.log("Chat Completion Error", error.response);
                            res.status(400).json({
                                message: "Open ai Chat Completion Error"
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
                const { apiType, messages } = body.filedObj
                await reduceToken(deviceId, uniqueId, apiProvider, apiType)

                if (apiType === "chatCompletions") {
                    try {
                        let chatCompletions = await axios({
                            url: 'https://api.mistral.ai/v1/chat/completions',
                            method: 'post',
                            headers: {
                                'Authorization': `Bearer ${process.env.MISTRAL_AI_API_KEY}`,
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            data: {
                                "model": "mistral-large-latest",
                                "messages": messages,
                                "temperature": 0.7,
                                "max_tokens": 256
                            }
                        });
                        const mistralRes = {
                            content: chatCompletions.data.choices[0]["message"],
                            userDetails: apiSendUserDetails
                        }

                        res.status(200).json({
                            data: mistralRes
                        })
                    } catch (error) {
                        res.status(400).json({
                            message: "Mistral chat completions erorr",
                        })
                    }
                }
            }

            if (apiProvider === "Gemini") {
                const { apiType, contents } = body.filedObj
                const createNewArray = contents.map(item => ({
                    role: item.role,
                    parts: [
                        { text: item.text || "" }
                    ]
                }));
                await reduceToken(deviceId, uniqueId, apiProvider, apiType)
                if (apiType === "chatCompletions") {
                    try {
                        let chatCompletions = await axios({
                            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                            method: 'post',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            data: {
                                contents: createNewArray
                            }
                        });
                        chatCompletions = chatCompletions.data
                        const resChatCompletions = {
                            content: {
                                role: chatCompletions.candidates[0]["content"]["role"],
                                text: chatCompletions.candidates[0]["content"]["parts"][0]["text"]
                            },
                            userDetails: apiSendUserDetails
                        }

                        res.status(200).json({
                            data: resChatCompletions
                        })
                    } catch (error) {
                        console.log("--error---", error.response.data)
                        res.status(400).json({
                            message: "Gemini chat completion error",
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