const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");

exports.runAssi = async (req, res) => {
    try {
        const openAi = await getToken('openAi');
        const id = req.params.id
        const findAssi = await Assistant.findOne({
            where: {
                isActive: 1,
                hashId: id

            }
        })
        const { threadId, role, contents } = req.body;
        if (findAssi == null) {
            res.status(400).json({
                message: "Assistant Not Found"
            })
        }

        const userDetails = await checkToken(req.body.deviceId)
        const apiSendUserDetails = pick(userDetails, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

        // await reduceToken(deviceId, uniqueId, "Bot", type, true)

        if (!threadId && !role && contents.length == 0) {
            res.status(400).json({
                message: "Invalid Input"
            })
        } else {
            const assistantId = findAssi.dataValues.assistantId

            try {
                const newSummriRes = {}
                let runSummari = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${openAi.token}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        role: role,
                        content: contents
                    }
                });
                // newSummriRes["id"] = runSummari.data.id

                const runSummRes = await axios.post(
                    `https://api.openai.com/v1/threads/${threadId}/runs`,
                    {
                        assistant_id: assistantId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${openAi.token}`,
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
                                    Authorization: `Bearer ${openAi.token}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                            }
                        );

                        runStatus = pollRes.data.status;
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
                            Authorization: `Bearer ${openAi.token}`,
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
                console.log("--error---",error)
                res.status(400).json({
                    message: error.response.data.error.message
                })
            }
        }


    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};