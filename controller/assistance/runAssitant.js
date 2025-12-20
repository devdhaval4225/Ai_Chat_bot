const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken, getModelToken, getAssToken } = require("../../config/manageToken");
const AssistantModel = require("../../model/assistanceModel");
const commonFunction = require("../../common/commonFunction");

exports.runAssi = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueid
        const appVersion = req.headers.appversion
        const id = req.params.id
        const body = req.body;
        const userDetails = await checkToken(req.body.deviceId)
        const apiSendUserDetails = pick(userDetails, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

        const findAssi = await AssistantModel.findOne({
            where: {
                isActive: 1,
                hashId: id
            }
        })
        // const { threadId } = req.body;
        if (findAssi == null) {
            return res.status(400).json({
                message: "Assistant Not Found"
            })
        }


        const openAiToken = await getModelToken("openAi");


        const modelTokens = await getAssToken(id);
        const assistantId = findAssi.dataValues.assistantId
        const token = apiSendUserDetails.isSubscribe == 1 ? openAiToken.proToken : openAiToken.token
        const rToken = modelTokens.reduceToken
        const assiName = modelTokens.name

        let filedObj = body && body.filedObj ? body.filedObj : {}


        if (!filedObj.threadId || filedObj.threadId == null) {
            try {
                let createThread = await axios({
                    url: 'https://api.openai.com/v1/threads',
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    }
                });
                const pickThredData = pick(createThread.data, 'id')
                await reduceToken(body.deviceId, uniqueId, "openAi", `${assiName}`, true, rToken)

                filedObj["threadId"] = pickThredData.id
            } catch (error) {
                // console.log("--error--", error)
                res.status(400).json({
                    message: error.response.data.error.message
                })
            }
        }

        if (body && body.filedObj && body.filedObj.contents) {

            for (const item of filedObj.contents) {
                const checkStatus = await commonFunction.checkModeration(item.text);
                if (checkStatus) {
                    return res.status(400).json({
                        message: `A "${item.text}" might refer to content that is explicit, sexual, or involves descriptions of nudity. However, sharing or promoting such text is often inappropriate and may violate community guidelines, moral standards, and even laws in some cases.

If you're using the term in a different context, could you please provide more details to help me better understand what you mean?`
                    });
                }
            }
            const updated = body.filedObj.contents.map(obj => {
                const newObj = { ...obj };
                if ("role" in newObj) delete newObj.role;
                return newObj;
            });
            const newContents = updated.map(({ ...rest }) => ({
                ...rest,
                type: "text"
            }));

            try {
                try {
                    let runSummari = await axios({
                        url: `https://api.openai.com/v1/threads/${filedObj.threadId}/messages`,
                        method: 'post',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            role: "user",
                            content: newContents
                        }
                    });
                } catch (error) {
                    console.log("---QUERY--", error.response.data);
                    res.status(400).json({
                        message: error.response.data.error.message,
                        status: 400
                    });
                }

                let runRes = ""
                try {
                    runRes = await axios.post(
                        `https://api.openai.com/v1/threads/${filedObj.threadId}/runs`,
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
                } catch (error) {
                    console.log("---error.response---", error)
                    res.status(400).json({
                        message: error.response.data.error.message,
                        status: 400
                    });
                }

                const runId = runRes.data.id;

                let runStatus = 'queued';
                while (runStatus !== 'completed') {
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    try {
                        const pollRes = await axios.get(
                            `https://api.openai.com/v1/threads/${filedObj.threadId}/runs/${runId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
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
                        console.log("---error--", error.response.data);
                        res.status(400).json({
                            message: error.response.data.error.message,
                            status: 400
                        });
                    }
                }

                let answerRes = await axios.get(
                    `https://api.openai.com/v1/threads/${filedObj.threadId}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json'
                        },
                    }
                );

                answerRes = answerRes.data.data
                const lastMsg = answerRes.find((m) => m.role === "assistant");

                let newSummriRes = {}
                if (appVersion && appVersion >= 21) {
                    newSummriRes = {
                        content: {
                            role: lastMsg.role,
                            text: lastMsg["content"][0]["text"]["value"] || "",
                            threadId: filedObj.threadId
                        },
                        userDetails: apiSendUserDetails
                    };
                } else {
                    newSummriRes["content"] = [{
                        role: lastMsg.role,
                        text: lastMsg["content"][0]["text"]["value"] || ""
                    }]
                    newSummriRes["userDetails"] = apiSendUserDetails
                }

                res.status(200).json({
                    data: newSummriRes
                })
            } catch (error) {
                console.log("--error---", error)
                res.status(400).json({
                    message: error.response.data.error.message
                })
            }

        } else {
            res.status(400).json({
                message: "Messages Missing"
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