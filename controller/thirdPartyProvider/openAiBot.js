const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken, getModelToken } = require("../../config/manageToken");
const commonFunction = require("../../common/commonFunction");
const AiTool = require("../../model/aitoolModel");


// type
//     summarizerBot
//     spellCheckerBot

exports.aiBot = async (req, res) => {
    try {
        const summarizerBotToken = await getToken('openAi-summarizerBot');
        const spellCheckerBotToken = await getToken('openAi-spellCheckerBot');

        const summary_Ass_ID = JSON.parse(summarizerBotToken.metadata).assId
        const spell_Ass_ID = JSON.parse(spellCheckerBotToken.metadata).assId

        const { type, threadId, role, content, message, deviceId, id } = req.body;
        const header = req.headers
        const uniqueId = header['uniqueid'];
        const userDetails = await checkToken(req.body.deviceId)
        const apiSendUserDetails = pick(userDetails, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

        // await reduceToken(deviceId, uniqueId, "Bot", type, true)

        if (threadId && role && content) {
            
            for (const item of content) {
                const checkStatus = await commonFunction.checkModeration(item.text);
                if (checkStatus) {
                    return res.status(400).json({
                        message: `A "${item.text}" might refer to content that is explicit, sexual, or involves descriptions of nudity. However, sharing or promoting such text is often inappropriate and may violate community guidelines, moral standards, and even laws in some cases.

If you're using the term in a different context, could you please provide more details to help me better understand what you mean?`
                    });
                }
            }

            let assistantId
            let modelTokens = await getModelToken("openAi");
            if (!id) {
                assistantId = type === "summarizerBot" ? summary_Ass_ID : spell_Ass_ID
            } else {
                const findAssistantId = await AiTool.findOne({
                    where: { isActive: 1, hashId: id },
                    attributes: ["assistantId", "model"]
                });
                assistantId = findAssistantId?.assistantId
                console.log("---findAssistantId?.token----",findAssistantId?.token)
                modelTokens = await getModelToken("openAi", findAssistantId?.token);
            }
            const token = apiSendUserDetails.isSubscribe == 1 ? modelTokens.proToken : modelTokens.token
            try {
                const newSummriRes = {}
                let runSummari = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        role: role,
                        content: content
                    }
                });
                newSummriRes["id"] = runSummari.data.id

                const runSummRes = await axios.post(
                    `https://api.openai.com/v1/threads/${threadId}/runs`,
                    {
                        assistant_id: assistantId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const runUploadId = runSummRes.data.id;

                let runStatus = 'queued';
                while (runStatus !== 'completed') {
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    try {
                        const pollRes = await axios.get(
                            `https://api.openai.com/v1/threads/${threadId}/runs/${runUploadId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                            }
                        );

                        runStatus = pollRes.data.status;
                        console.log("--runStatus summari----", runStatus)
                        if (runStatus === 'failed' || runStatus === 'cancelled') {
                            res.status(400).json({
                                message: `Run ${runStatus}`,
                                status: 400
                            })
                            return;
                        }
                    } catch (error) {
                        console.log("---error--", error);
                        res.status(400).json({
                            message: error.response.data.error.message,
                            status: 400
                        });
                        return;
                    }
                }

                let answerRes = await axios.get(
                    `https://api.openai.com/v1/threads/${threadId}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json'
                        },
                    }
                );
                answerRes = answerRes.data
                newSummriRes["content"] = [{
                    role: answerRes.data[0].role,
                    text: answerRes.data[0]["content"][0]["text"]["value"] || ""
                }];
                newSummriRes["userDetails"] = apiSendUserDetails

                res.status(200).json({
                    data: newSummriRes
                })
            } catch (error) {
                res.status(400).json({
                    message: error.response.data.error.message
                })
            }
            // if (type === "spellCheckerBot") {
            //     try {
            //         let runSpellChecker = await axios({
            //         url: `https://api.openai.com/v1/threads/${threadId}/messages`,
            //         method: 'post',
            //         headers: {
            //             Authorization: `Bearer ${apiSendUserDetails.isSubscribe == 1 ? spellCheckerBotToken.subscribe_token : spellCheckerBotToken.token}`,
            //             'OpenAI-Beta': 'assistants=v2',
            //             'Content-Type': 'application/json'
            //         },
            //         data: {
            //             role: role,
            //             content: content
            //         }
            //         });

            //         const pickSpellChecker = pick(runSpellChecker.data, ['id', 'content'])
            //         pickSpellChecker.content = pickSpellChecker.content.map(c => ({ text: pick(c.text, ['value']), type: c.type }));
            //         runSpellChecker = pickSpellChecker
            //         runSpellChecker["userDetails"] = apiSendUserDetails

            //         res.status(200).json({
            //             data: runSpellChecker
            //         })
            //     } catch (error) {
            //         res.status(400).json({
            //             message: error.response.data.error.message
            //         })
            //     }
            // }

        } else {
            res.status(400).json({
                message: "Invalid Input"
            })
        }


    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};