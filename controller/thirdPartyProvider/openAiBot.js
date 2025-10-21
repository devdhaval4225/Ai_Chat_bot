const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const summary_Ass_ID = "asst_8XphHk5hHVolGxVPfMkQqf5i"
const spell_Ass_ID = "asst_Yshc3HmPy5zJuCbTAcjze0r1"

// type
//     summarizerBot
//     spellCheckerBot

exports.aiBot = async (req, res) => {
    try {
        const summarizerBotToken = await getToken('openAi-summarizerBot');
        const spellCheckerBotToken = await getToken('openAi-spellCheckerBot');
        
        const { type, threadId, role, content, message, deviceId } = req.body;
        const header = req.headers
        const uniqueId = header['uniqueid'];
        const userDetails = await checkToken(req.body.deviceId)
        const apiSendUserDetails = pick(userDetails, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

        // await reduceToken(deviceId, uniqueId, "Bot", type, true)

        if (threadId && role && content) {
            const assistantId = type === "summarizerBot" ? summary_Ass_ID : spell_Ass_ID
            try {
                const newSummriRes = {}
                let runSummari = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${apiSendUserDetails.isSubscribe == 1 ? summarizerBotToken.subscribe_token : summarizerBotToken.token}`,
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
                            Authorization: `Bearer ${apiSendUserDetails.isSubscribe == 1 ? summarizerBotToken.subscribe_token : summarizerBotToken.token}`,
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
                                    Authorization: `Bearer ${apiSendUserDetails.isSubscribe == 1 ? summarizerBotToken.subscribe_token : summarizerBotToken.token}`,
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
                            Authorization: `Bearer ${apiSendUserDetails.isSubscribe == 1 ? summarizerBotToken.subscribe_token : summarizerBotToken.token}`,
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
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};