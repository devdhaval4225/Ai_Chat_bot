// const OpenAI = require("openai");
// const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
// const path = require('path');
// const fs = require('fs');
// const FormData = require('form-data');
// const axios = require("axios");
// const { reduceToken } = require("../../helper/common");



// exports.pdfSummaryBot = async (req, res) => {
//     try {
//         const header = req.headers
//         const uniqueId = header['uniqueid'];
//         await reduceToken(req.body.deviceId, uniqueId, "Bot", "pdfSummaryBot")


//         const fileExtName = path.extname(req.file.originalname).toLowerCase()
//         if ([".pdf", ".txt"].includes(fileExtName)) {
//             const message = `Expected file type to be a supported format: .jpeg, .jpg, .png, .gif, .webp but got ${fileExtName}.`;
//             fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
//                 if (err) throw err;
//             });
//             return res.status(400).json({
//                 message: message,
//                 status: 400
//             })

//         }
//         const purpose = [".pdf", ".txt"].includes(fileExtName) ? "assistants" : "vision"

//         const form = new FormData();
//         form.append('file', fs.createReadStream(req.file.path));
//         form.append('purpose', purpose);

//         let fileUpload = await axios({
//             url: 'https://api.openai.com/v1/files',
//             method: 'post',
//             headers: {
//                 Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
//                 'OpenAI-Beta': 'assistants=v2',
//                 'Content-Type': 'application/json',
//                 ...form.getHeaders()
//             },
//             data: form
//         });
//         fileUpload = fileUpload.data

//         fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
//             if (err) throw err;
//             console.log('File deleted');
//         });

//         let createThread = await axios({
//             url: 'https://api.openai.com/v1/threads',
//             method: 'post',
//             headers: {
//                 Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
//                 'OpenAI-Beta': 'assistants=v2',
//                 'Content-Type': 'application/json'
//             }
//         });
//         createThread = createThread.data


//         let sendMessageResponse = await axios({
//             url: `https://api.openai.com/v1/threads/${createThread.id}/messages`,
//             method: 'post',
//             headers: {
//                 'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
//                 'OpenAI-Beta': 'assistants=v2',
//                 'Content-Type': 'application/json'
//             },
//             data: {
//                 role: 'user',
//                 content: [
//                     {
//                         type: 'text',
//                         text: req.body.text || 'Please summarize this PDF'
//                     },
//                     {
//                         type: 'image_file',
//                         image_file: {
//                             file_id: fileUpload.id
//                         }
//                     }
//                 ]
//             }

//         })

//         sendMessageResponse = sendMessageResponse.data

//         res.status(200).json({
//             data: sendMessageResponse,
//             status: 200
//         })

//     } catch (error) {
//         console.log(error.response);

//         fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
//             if (err) throw err;
//             console.log('File deleted');
//         });

//         res.status(500).json({
//             message: "Something went wrong",
//             status: 500
//         })
//     }
// }


const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require("axios");
const { reduceToken } = require("../../helper/common");
const assistantId = "asst_78BTjDEhrFqOUDZyPkYpBJdO"



exports.pdfSummaryBot = async (req, res) => {
    try {
        const header = req.headers
        const uniqueId = header['uniqueid'];
        await reduceToken(req.body.deviceId, uniqueId, "Bot", "pdfSummaryBot")


        if (req.body.type === "upload") {
            try {
                // Pdf Upload
                const fileExtName = path.extname(req.file.originalname).toLowerCase()
                const mimeType = [".pdf"]
                // const mimeType = [".c", ".cpp", ".cs", ".css", ".doc", ".docx", ".go", ".html", ".java", ".js", ".json", ".md", ".pdf", ".php", ".pptx", ".py", ".Py", ".rb", ".sh", ".tex", ".ts", ".txt"]
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


                // Thread in send Message and find attachments 
                let sendMessageResponse = await axios({
                    url: `https://api.openai.com/v1/threads/${threadUploadId}/messages`,
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPEN_AI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
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
                            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                            'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json',
                        },
                    }
                );

                const runUploadId = runRes.data.id;

                res.status(200).json({
                    data: { threadId: threadUploadId, runId: runUploadId },
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
                // ✅ Poll run status
                let runStatus = 'queued';
                console.log("-=-=-=-=runStatus-=-=-",runStatus)
                while (runStatus !== 'completed') {
                    await new Promise((resolve) => setTimeout(resolve, 1000));

                    try {
                        const pollRes = await axios.get(
                            `https://api.openai.com/v1/threads/${body.threadId}/runs/${body.runId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                                    'OpenAI-Beta': 'assistants=v2',
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
                        console.log("---error--", error.response);
                        res.status(500).json({
                            message: "Error polling run status",
                            status: 500
                        });
                        return;
                    }


                }

                // ✅ Get final answer
                let answerRes = await axios.get(
                    `https://api.openai.com/v1/threads/${threadId}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                            'OpenAI-Beta': 'assistants=v2',
                        },
                    }
                );
                answerRes = answerRes.data

                res.status(200).json({
                    data: answerRes,
                    status: 200
                })
            } catch (error) {
                console.log(error);

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