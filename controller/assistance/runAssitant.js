const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const AssistantModel = require("../../model/assistanceModel");

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
        const { threadId } = req.body;
        if (findAssi == null) {
            return res.status(400).json({
                message: "Assistant Not Found"
            })
        }
        const assistantId = findAssi.dataValues.assistantId
        const filedObj = body && body.filedObj ? body.filedObj : {}


        if (!threadId) {
            res.status(400).json({
                message: "Thread Id Missing"
            })
        }

        if (body && body.filedObj && body.filedObj.contents) {

            const newContents = body.filedObj.contents.map(obj => ({
                ...obj,
                content: obj.text,
            }));

            try {
                const newSummriRes = {}
                try {
                    let runSummari = await axios({
                        url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                        method: 'post',
                        headers: {
                            Authorization: `Bearer ${openAi.token}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            role: "user",
                            content: body.filedObj.contents
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
                } catch (error) {
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
                            `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
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
                    `https://api.openai.com/v1/threads/${threadId}/messages`,
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

        // if (!threadId && !role && contents.length == 0) {
        //     res.status(400).json({
        //         message: "Invalid Input"
        //     })
        // } else {
        //     try {
        //         const newSummriRes = {}
        //         let runSummari = await axios({
        //             url: `https://api.openai.com/v1/threads/${threadId}/messages`,
        //             method: 'post',
        //             headers: {
        //                 Authorization: `Bearer ${openAi.token}`,
        //                 'OpenAI-Beta': 'assistants=v2',
        //                 'Content-Type': 'application/json'
        //             },
        //             data: {
        //                 role: role,
        //                 content: contents
        //             }
        //         });
        //         // newSummriRes["id"] = runSummari.data.id

        //         const runRes = await axios.post(
        //             `https://api.openai.com/v1/threads/${threadId}/runs`,
        //             {
        //                 assistant_id: assistantId,
        //             },
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${openAi.token}`,
        //                     'OpenAI-Beta': 'assistants=v2',
        //                     'Content-Type': 'application/json',
        //                 },
        //             }
        //         );
        //         const runUploadId = runRes.data.id;

        //         let runStatus = 'queued';
        //         while (runStatus !== 'completed') {
        //             await new Promise((resolve) => setTimeout(resolve, 1000));

        //             try {
        //                 const pollRes = await axios.get(
        //                     `https://api.openai.com/v1/threads/${threadId}/runs/${runUploadId}`,
        //                     {
        //                         headers: {
        //                             Authorization: `Bearer ${openAi.token}`,
        //                             'OpenAI-Beta': 'assistants=v2',
        //                             'Content-Type': 'application/json'
        //                         },
        //                     }
        //                 );

        //                 runStatus = pollRes.data.status;
        //                 if (runStatus === 'failed' || runStatus === 'cancelled') {
        //                     res.status(400).json({
        //                         message: `Run ${runStatus}`,
        //                         status: 400
        //                     })
        //                     return;
        //                 }
        //             } catch (error) {
        //                 console.log("---error--", error);
        //                 res.status(400).json({
        //                     message: error.response.data.error.message,
        //                     status: 400
        //                 });
        //                 return;
        //             }
        //         }

        //         let answerRes = await axios.get(
        //             `https://api.openai.com/v1/threads/${threadId}/messages`,
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${openAi.token}`,
        //                     'OpenAI-Beta': 'assistants=v2',
        //                     'Content-Type': 'application/json'
        //                 },
        //             }
        //         );

        //         answerRes = answerRes.data
        //         newSummriRes["content"] = [{
        //             role: answerRes.data[0].role,
        //             text: answerRes.data[0]["content"][0]["text"]["value"] || ""
        //         }];
        //         newSummriRes["userDetails"] = apiSendUserDetails

        //         res.status(200).json({
        //             data: newSummriRes
        //         })
        //     } catch (error) {
        //         console.log("--error---", error)
        //         res.status(400).json({
        //             message: error.response.data.error.message
        //         })
        //     }
        // }


    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};