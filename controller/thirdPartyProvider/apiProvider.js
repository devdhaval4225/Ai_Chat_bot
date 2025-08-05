const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const User = require("../../model/user.model");

exports.provider = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueId
        // const { deviceId } = req.params
        const body = req.body
        const { apiProvider, deviceId } = body

        const notusedToken = await checkToken(body.deviceId)
        const reminToken = notusedToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            if (apiProvider === "OpenAi") {
                const { threadId, assistant_id, runId, messages, openAiApiType } = body.openAi
                let getMetadata = notusedToken.metadata != null ? JSON.parse(notusedToken.metadata) : {}
                const getThredId = (getMetadata && getMetadata.openAi && getMetadata.openAi.threadId) === threadId ? false : true
                if (openAiApiType === "createThread") {
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
                        createThread = createThread.data
                        createThread["userDetails"] = notusedToken

                        getMetadata["openAi"] = createThread.id
                        await reduceToken(deviceId, uniqueId, apiProvider, openAiApiType)
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
                if (openAiApiType === "threadRun") {
                    if (body && body.openAi && threadId && assistant_id) {
                        if (getThredId) {
                            await reduceToken(deviceId, uniqueId, apiProvider, openAiApiType)
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
                            createThreadRun["userDetails"] = notusedToken


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
                if (openAiApiType === "getThreadRunStatus") {

                    if (body && body.openAi && threadId && runId) {

                        if (getThredId) {
                            await reduceToken(deviceId, uniqueId, apiProvider, openAiApiType)
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
                            getRunStatus["userDetails"] = notusedToken

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
                if (openAiApiType === "chatCompletion") {
                    await reduceToken(deviceId, uniqueId, apiProvider, openAiApiType)
                    if (body && body.openAi && messages) {
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
                                    messages: messages
                                }
                            });
                            getRunStatus = getRunStatus.data
                            getRunStatus["userDetails"] = notusedToken

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
                const { mistralAiApiType, messages } = body.mistralAi
                await reduceToken(deviceId, uniqueId, apiProvider, mistralAiApiType)

                if (mistralAiApiType === "chatCompletions") {
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
                                "messages": [
                                    {
                                        "role": "user",
                                        "content": "Hello!"
                                    }
                                ],
                                "temperature": 0.7,
                                "max_tokens": 256
                            }
                        });
                        chatCompletions = chatCompletions.data
                        chatCompletions["userDetails"] = notusedToken

                        res.status(200).json({
                            data: chatCompletions
                        })
                    } catch (error) {
                        res.status(400).json({
                            message: "Mistral chat completions erorr",
                        })
                    }
                }
            }

            if (apiProvider === "Gemini") {
                const { geminiAiApiType, contents } = body.gemini
                await reduceToken(deviceId, uniqueId, apiProvider, geminiAiApiType)
                if (geminiAiApiType === "chatCompletions") {
                    try {
                        let chatCompletions = await axios({
                            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
                            method: 'post',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            data: {
                                contents: contents
                            }
                        });
                        chatCompletions = chatCompletions.data
                        chatCompletions["userDetails"] = notusedToken

                        res.status(200).json({
                            data: chatCompletions
                        })
                    } catch (error) {
                        console.log("--error---", error.response.data)
                        res.status(400).json({
                            message: "Gemini chat completion error",
                        })
                    }
                }
            }

            // if (apiProvider === "Deepseek") {
            //     const OpenAI = require("openai");
            //     const openai = new OpenAI({
            //         apiKey: process.env.DEEPSEEK_API_KEY, // Replace with a valid DeepSeek API key
            //         baseURL: "https://api.deepseek.com",
            //     });

            //     const { deepseekAiApiType, messages } = body.deepseek
            //     await reduceToken(deviceId, uniqueId, apiProvider, deepseekAiApiType)
            //     if (deepseekAiApiType === "chatCompletions") {
            //         try {
            //             const sendMessage = await openai.chat.completions.create({
            //                 model: "deepseek-chat", // Try "deepseek-chat" if "deepseek-reasoner" fails
            //                 messages: messages,
            //             });
            //             sendMessage["userDetails"] = notusedToken

            //             res.status(200).json({
            //                 data: sendMessage
            //             })
            //         } catch (error) {
            //             console.log("--error---", error.response.data)
            //             res.status(400).json({
            //                 message: "Deepseek chat completion error",
            //             })
            //         }
            //     }
            // }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};