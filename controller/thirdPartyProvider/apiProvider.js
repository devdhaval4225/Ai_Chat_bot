const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");

exports.provider = async (req, res) => {
    try {
        const { deviceId, uniqueId } = req.params
        const body = req.body
        const apiProvider = body.apiProvider
        const { openAiApiType,threadId, assistant_id, runId, } = body.openAi
        const { mistralAiApiType } = body.mistralAi

        const notUseToken = await checkToken(deviceId)
        const reminToken = notUseToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            if (apiProvider === "OpenAi") {
                if (openAiApiType === "createThread") {
                    // await reduceToken(deviceId, apiProvider, openAiApiType)
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

                    return res.status(200).json({
                        data: createThread
                    })
                }
                if (openAiApiType === "threadSendMessages") {
                    if(body && body.threadId){
                        // await reduceToken(deviceId, apiProvider, openAiApiType)
                        let createThread = await axios({
                            url: `https://api.openai.com/v1/https://api.openai.com/v1/threads/${threadId}/messages`,
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            }
                        });
                        createThread = createThread.data

                        res.status(200).json({
                            data: createThread
                        })
                    } else {
                        res.status(400).json({
                            message: "Thread Id Missing"
                        })
                    }

                }
                if (openAiApiType === "threadRun") {

                    if(body && body.threadId && body.assistant_id){

                        // await reduceToken(deviceId, apiProvider, openAiApiType)

                        let createThreadRun = await axios({
                            url: `https://api.openai.com/v1/threads/${threadId}/runs`,
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                            body: {
                                assistant_id: assistant_id
                            }
                        });
                        createThreadRun = createThreadRun.data

                        res.status(200).json({
                            data: createThreadRun
                        })
                        
                    } else {
                        res.status(400).json({
                            message: "Thread and Assistant Id Missing"
                        })
                    }

                }
                if (openAiApiType === "getThreadRunStatus") {

                    if(body && body.threadId && body.runId){

                        // await reduceToken(deviceId, apiProvider, openAiApiType)

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

                        res.status(200).json({
                            data: createThreadRun
                        })
                        
                    } else {
                        res.status(400).json({
                            message: "Thread and Run Id Missing"
                        })
                    }

                }
            }

            if (apiProvider === "MistralAi") {
                if (mistralAiApiType === "chatCompletions") {
                    // await reduceToken(deviceId, apiProvider, mistralAiApiType)
                    let createThread = await axios({
                        url: 'https://api.mistral.ai/v1/chat/completions',
                        method: 'post',
                        headers: {
                            'Authorization': `Bearer ${process.env.MISTRAL_AI_API_KEY}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:{

                        }
                    });
                    createThread = createThread.data

                    return res.status(200).json({
                        data: createThread
                    })
                }
            }
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SOMETHING WENT WRONG",
            status: 500
        })
    }
};