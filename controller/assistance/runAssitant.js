const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const AssistantModel = require("../../model/assistanceModel");
const commonFunction = require("../../common/commonFunction");

exports.runAssi = async (req, res) => {
    try {
        const openAi = await getToken('openAi');
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
        const assistantId = findAssi.dataValues.assistantId
        const filedObj = body && body.filedObj ? body.filedObj : {}


        if (!filedObj.threadId) {
            res.status(400).json({
                message: "Thread Id Missing"
            })
        }

        if (body && body.filedObj && body.filedObj.contents) {

            for (const item of filedObj.contents) {
                const checkStatus = await commonFunction.checkModeration(item.text);
                if (checkStatus) {
                    return res.status(400).json({
                        message: "Might contain sensitive content.",
                    });
                }
            }

            const newContents = body.filedObj.contents.map(({ ...rest }) => ({
                ...rest,
                type: "text"
            }));

            try {
                const newSummriRes = {}
                try {
                    let runSummari = await axios({
                        url: `https://api.openai.com/v1/threads/${filedObj.threadId}/messages`,
                        method: 'post',
                        headers: {
                            Authorization: `Bearer ${openAi.token}`,
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
                                Authorization: `Bearer ${openAi.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                } catch (error) {
                    console.log("---error.response---",error)
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
                            Authorization: `Bearer ${openAi.token}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json'
                        },
                    }
                );

                answerRes = answerRes.data.data
                const lastMsg = answerRes.find((m) => m.role === "assistant");

                newSummriRes["content"] = [{
                    role: lastMsg.role,
                    text: lastMsg["content"][0]["text"]["value"] || ""
                }];
                newSummriRes["userDetails"] = apiSendUserDetails

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