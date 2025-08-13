const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require("axios");
const { reduceToken } = require("../../helper/common");
const assistantId = "asst_78BTjDEhrFqOUDZyPkYpBJdO"
const { _, pick } = require("lodash")
const { checkToken } = require("../../helper/common");
const User = require("../..//model/user.model");



exports.pdfSummaryBot = async (req, res) => {
    try {
        const header = req.headers
        const uniqueId = header['uniqueid'];
        const userData = await checkToken(req.body.deviceId)
        const getMetadata = userData.metadata != null ? JSON.parse(userData.metadata) : {}
        const apiSendUserDetails = pick(userData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);


        if (req.body.type === "upload") {
            try {
                await reduceToken(req.body.deviceId, uniqueId, "Bot", "pdfSummaryBot-Upload")
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
                        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
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
                            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json',
                        },
                    }
                );
                createThread = createThread.data
                const threadUploadId = createThread.id


                // // Thread Run
                // const runRes = await axios.post(
                //     `https://api.openai.com/v1/threads/${threadUploadId}/runs`,
                //     {
                //         assistant_id: assistantId,
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                //             'OpenAI-Beta': 'assistants=v2',
                //             'Content-Type': 'application/json',
                //         },
                //     }
                // );
                // const runUploadId = runRes.data.id;

                getMetadata["pdfObj"] = { threadId: threadUploadId, fileId: fileId }
                await User.update(
                    { metadata: JSON.stringify(getMetadata) },
                    { where: { deviceId: req.body.deviceId } }
                );

                res.status(200).json({
                    data: { threadId: threadUploadId, fileId: fileId },
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
                console.log(error.response);
                res.status(500).json({
                    message: "Something went wrong",
                    status: 500
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

        if (req.body.type === "run") {
            try {
                const body = req.body

                const checkFileAndThred = (getMetadata && getMetadata.pdfObj && getMetadata.pdfObj) &&
                    body.threadId === getMetadata.pdfObj.threadId &&
                    body.fileId === getMetadata.pdfObj.fileId

                if (checkFileAndThred === false) {
                    getMetadata["pdfObj"] = { threadId: body.threadId, fileId: body.fileId }
                    await User.update(
                        { metadata: JSON.stringify(getMetadata) },
                        { where: { deviceId: body.deviceId } }
                    );
                    await reduceToken(body.deviceId, uniqueId, "Bot", "pdfSummaryBot-Run")
                }


                const runRes = await axios.post(
                    `https://api.openai.com/v1/threads/${body.threadId}/runs`,
                    {
                        assistant_id: assistantId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
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
                            `https://api.openai.com/v1/threads/${body.threadId}/runs/${runUploadId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                    'OpenAI-Beta': 'assistants=v2',
                                    'Content-Type': 'application/json'
                                },
                            }
                        );

                        runStatus = pollRes.data.status;
                        console.log("--runStatus---", runStatus)
                        if (runStatus === 'failed' || runStatus === 'cancelled') {
                            console.log("======runStatus======", runStatus)
                            res.status(400).json({
                                message: `Run ${runStatus}`,
                                status: 400
                            })
                            console.log("-=-=-=-=-=-=pollRes.data-=-==-", pollRes.data)
                            return;
                        }
                    } catch (error) {
                        console.log("---error--", error);
                        res.status(500).json({
                            message: "Error polling run status",
                            status: 500
                        });
                        return;
                    }


                }

                // // Thread in send Message and find attachments 
                let sendMessageResponse = await axios({
                    url: `https://api.openai.com/v1/threads/${body.threadId}/messages`,
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2'
                    },
                    data: {
                        role: 'user',
                        content: body.text,
                        attachments: [
                            {
                                file_id: body.fileId,
                                tools: [{ type: 'file_search' }],
                            },
                        ],
                    }

                })
                sendMessageResponse = sendMessageResponse.data

                // ✅ Get final answer
                let answerRes = await axios.get(
                    `https://api.openai.com/v1/threads/${body.threadId}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                            'OpenAI-Beta': 'assistants=v2',
                        },
                    }
                );
                answerRes = answerRes.data

                const formatted = answerRes.data.map(item => ({
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
            } catch (error) {
                console.log(error.response);

                res.status(500).json({
                    message: "Something went wrong",
                    status: 500
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