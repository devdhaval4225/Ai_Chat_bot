const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require("axios");
const { reduceToken } = require("../../helper/common");
const assistantId = "asst_pHnxNwc9yrNq3njeFL0bnAgG"
const { _, pick } = require("lodash")
const { checkToken } = require("../../helper/common");
const User = require("../..//model/user.model");
const { getToken } = require("../../config/manageToken");



exports.pdfSummaryBot = async (req, res) => {
    try {
        const header = req.headers
        const uniqueId = header['uniqueid'];
        const userData = await checkToken(req.body.deviceId)
        const getMetadata = userData.metadata != null ? JSON.parse(userData.metadata) : {}
        let updateUserData

        const openAiPdfToken = await getToken('openAiPdf');

        if (req.body.type === "upload") {
            if (userData.reminToken == 0) {
                res.status(400).json({
                    message: "Your Quota is Over"
                })
            } else {
                try {
                    await reduceToken(req.body.deviceId, uniqueId, "Bot", "pdfSummaryBot-Upload", true)
                    // Pdf Upload
                    const fileExtName = path.extname(req.file.originalname).toLowerCase()
                    const mimeType = [".pdf"]
                    if (!mimeType.includes(fileExtName)) {
                        const message = `Please upload only .pdf but got ${fileExtName}.`;
                        res.status(400).json({
                            message: message,
                            status: 400
                        })
                        fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            } else {
                                console.log('File deleted successfully');
                            }
                        });

                    }


                    const form = new FormData();
                    form.append('file', fs.createReadStream(req.file.path),
                        //  {
                        //     filename: path.basename(req.file.path),
                        //     contentType: 'application/pdf',
                        // }
                    );
                    form.append('purpose', 'assistants');

                    let fileUpload = await axios.post('https://api.openai.com/v1/files', form, {
                        headers: {
                            ...form.getHeaders(),
                            Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                        },
                    });
                    fileUpload = fileUpload.data
                    const fileId = fileUpload.id

                    // Thread  Create 
                    let createThread = await axios.post(
                        'https://api.openai.com/v1/threads',
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    createThread = createThread.data
                    const threadUploadId = createThread.id

                    const checkStatus = await commonFunction.checkModeration(req.body.text);
                    if (checkStatus) {
                      return res.status(400).json({
                        message: "Might contain sensitive content.",
                      });
                    }

                    // Thread in send Message and find attachments 
                    let sendMessageResponse = await axios({
                        url: `https://api.openai.com/v1/threads/${threadUploadId}/messages`,
                        method: 'post',
                        headers: {
                            'Authorization': `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                            'OpenAI-Beta': 'assistants=v2'
                        },
                        data: {
                            role: 'user',
                            content: req.body.text,
                            attachments: [
                                {
                                    file_id: fileId,
                                    tools: [{ type: 'file_search' }],
                                },
                            ],
                        }

                    })
                    sendMessageResponse = sendMessageResponse.data

                    // Thread Run
                    const runRes = await axios.post(
                        `https://api.openai.com/v1/threads/${threadUploadId}/runs`,
                        {
                            assistant_id: assistantId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    const runUploadId = runRes.data.id;

                    // ✅ Poll run status
                    let runStatus = 'queued';
                    while (runStatus !== 'completed') {
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        try {
                            const pollRes = await axios.get(
                                `https://api.openai.com/v1/threads/${threadUploadId}/runs/${runUploadId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                        'OpenAI-Beta': 'assistants=v2',
                                        'Content-Type': 'application/json'
                                    },
                                }
                            );

                            runStatus = pollRes.data.status;
                            console.log("--runStatus---", runStatus)
                            if (runStatus === 'failed' || runStatus === 'cancelled') {
                                res.status(400).json({
                                    message: `Run ${runStatus}`,
                                    status: 400
                                })
                                return;
                            }
                        } catch (error) {
                            res.status(400).json({
                                message: error.response.data.error.message,
                                status: 400
                            });
                            return;
                        }
                    }


                    getMetadata["pdfObj"] = { threadId: threadUploadId, runId: runUploadId, fileId: fileId }
                    await User.update(
                        { metadata: JSON.stringify(getMetadata) },
                        { where: { deviceId: req.body.deviceId } }
                    );

                    let answerRes = await axios.get(
                        `https://api.openai.com/v1/threads/${threadUploadId}/messages`,
                        {
                            headers: {
                                Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                        }
                    );
                    answerRes = answerRes.data
                    const formatted = answerRes.data.filter(item => item.role === 'assistant').map(item => ({
                        role: item.role,
                        text: item.content[0]?.text?.value || ""
                    }));


                    updateUserData = await checkToken(req.body.deviceId)

                    res.status(200).json({
                        data: { threadId: threadUploadId, content: formatted, userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']) },
                        status: 200
                    });

                    fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('File deleted successfully');
                        }
                    });
                } catch (error) {
                    console.log(error);
                    res.status(400).json({
                        message: error.response.data.error.message,
                        status: 400
                    })

                    fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('File deleted successfully');
                        }
                    });
                }
            }
        }

        if (req.body.type === "run") {
            updateUserData = await checkToken(req.body.deviceId)
            const apiSendUserDetails = pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

            try {
                const body = req.body
                    const checkStatus = await commonFunction.checkModeration(body.text);
                    if (checkStatus) {
                        return res.status(400).json({
                          message: "Might contain sensitive content.",
                        });
                    }

                const checkFileAndThred = (getMetadata && getMetadata.pdfObj && getMetadata.pdfObj) &&
                    body.threadId === getMetadata.pdfObj.threadId &&
                    body.fileId === getMetadata.pdfObj.fileId

                if (body.text) {
                    let sendMessage = await axios({
                        url: `https://api.openai.com/v1/threads/${body.threadId}/messages`,
                        method: 'post',
                        headers: {
                            'Authorization': `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                            'OpenAI-Beta': 'assistants=v2'
                        },
                        data: {
                            role: 'user',
                            content: [{
                                type: 'text',
                                'text': body.text
                            }],
                            // content: body.text,
                        }

                    })

                    const runRes = await axios.post(
                        `https://api.openai.com/v1/threads/${body.threadId}/runs`,
                        {
                            assistant_id: assistantId,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    const runUploadId = runRes.data.id;
                    let runStatus = 'queued';
                    while (runStatus !== 'completed') {
                        await new Promise((resolve) => setTimeout(resolve, 1000));

                        try {
                            const pollRes = await axios.get(
                                `https://api.openai.com/v1/threads/${body.threadId}/runs/${runUploadId}`,
                                {
                                    headers: {
                                        Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                        'OpenAI-Beta': 'assistants=v2',
                                        'Content-Type': 'application/json'
                                    },
                                }
                            );

                            runStatus = pollRes.data.status;
                            console.log("--runStatus---", runStatus)
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
                        `https://api.openai.com/v1/threads/${body.threadId}/messages`,
                        {
                            headers: {
                                Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                        }
                    );
                    answerRes = answerRes.data
                    const senMesFormatted = [{
                        role: answerRes.data[0].role,
                        text: answerRes.data[0]["content"][0]["text"]["value"] || ""
                    }];

                    res.status(200).json({
                        data: {
                            content: senMesFormatted,
                            userDetails: apiSendUserDetails
                        },
                        status: 200
                    })

                } else {
                    let answerRes = await axios.get(
                        `https://api.openai.com/v1/threads/${body.threadId}/messages`,
                        {
                            headers: {
                                Authorization: `Bearer ${userData.isSubscribe == 1 ? openAiPdfToken.subscribe_token : openAiPdfToken.token}`,
                                'OpenAI-Beta': 'assistants=v2',
                                'Content-Type': 'application/json'
                            },
                        }
                    );
                    answerRes = answerRes.data

                    const formatted = answerRes.data.filter(item => item.role === 'assistant').map(item => ({
                        role: item.role,
                        text: item.content[0]?.text?.value || ""
                    }));

                    res.status(200).json({
                        data: {
                            content: formatted,
                            userDetails: apiSendUserDetails
                        },
                        status: 200
                    })
                }
            } catch (error) {
                console.log(error.response);
                res.status(400).json({
                    message:error.response.data.error.message,
                    status: 400
                })
            }
        }

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
}