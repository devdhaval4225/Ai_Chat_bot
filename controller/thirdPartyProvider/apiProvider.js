const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");

exports.provider = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueId
        const { deviceId } = req.params
        const body = req.body
        const { apiProvider } = body

        const notUseToken = await checkToken(deviceId)
        const reminToken = notUseToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            if (apiProvider === "OpenAi") {
                const { threadId, assistant_id, runId, messages, openAiApiType } = body.openAi
                await reduceToken(deviceId, uniqueId, apiProvider, openAiApiType)
                if (openAiApiType === "createThread") {
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
                    if(body && body.openAi && threadId){
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

                    if(body && body.openAi && threadId && assistant_id){

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

                    if(body && body.openAi && threadId && runId){

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
                if (openAiApiType === "chatCompletion") {

                    if(body && body.openAi && messages){

                        let getRunStatus = await axios({
                            url: `https://api.openai.com/v1/chat/completions`,
                            method: 'get',
                            headers: {
                                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                // 'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                            body: {
                                "model": "gpt-4o",
                                messages: messages
                            }
                        });
                        getRunStatus = getRunStatus.data

                        res.status(200).json({
                            data: createThreadRun
                        })
                        
                    } else {
                        res.status(400).json({
                            message: "Messages Missing"
                        })
                    }

                }
            }

            if (apiProvider === "MistralAi") {
                const { mistralAiApiType,messages } = body.mistralAi
                await reduceToken(deviceId, uniqueId, apiProvider, mistralAiApiType)

                if (mistralAiApiType === "chatCompletions") {
                    let chatCompletions = await axios({
                        url: 'https://api.mistral.ai/v1/chat/completions',
                        method: 'post',
                        headers: {
                            'Authorization': `Bearer ${process.env.MISTRAL_AI_API_KEY}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:{
                            "model": "mistral-large-latest",
                            messages:messages
                        }
                    });
                    chatCompletions = chatCompletions.data

                    return res.status(200).json({
                        data: chatCompletions
                    })
                }
            }
            
            if(apiProvider === "Gemini"){
                const { geminiAiApiType, contents } = body.gemini
                await reduceToken(deviceId, uniqueId, apiProvider, geminiAiApiType)
                if (geminiAiApiType === "chatCompletions") {
                    let chatCompletions = await axios({
                        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
                        method: 'post',
                        headers: {
                            'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body:{
                            "contents": contents
                        }
                    });
                    chatCompletions = chatCompletions.data

                    return res.status(200).json({
                        data: chatCompletions
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