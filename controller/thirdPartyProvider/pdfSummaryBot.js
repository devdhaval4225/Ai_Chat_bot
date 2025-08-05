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


        // Pdf Upload
        const fileExtName = path.extname(req.file.originalname).toLowerCase()
        if (![".pdf"].includes(fileExtName)) {
            const message = `Please upload only .pdf but got ${fileExtName}.`;
            // const message = `Expected file type to be a supported format: .jpeg, .jpg, .png, .gif, .webp but got ${fileExtName}.`;
            fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
                if (err) throw err;
            });
            return res.status(400).json({
                message: message,
                status: 400
            })

        }


        const form = new FormData();
        form.append('file', fs.createReadStream(req.file.path), {
            filename: path.basename(req.file.path),
            contentType: 'application/pdf',
        });
        form.append('purpose', 'assistants');

        let fileUpload = await axios.post('https://api.openai.com/v1/files', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
            },
        });
        fileUpload = fileUpload.data
        const fileId = fileUpload.id

        fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
            if (err) throw err;
            console.log('File deleted');
        });
        // ==============================================================

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
        const threadId = createThread.id
        // ==============================================================


        // Thread in send Message and find attachments 
        let sendMessageResponse = await axios({
            url: `https://api.openai.com/v1/threads/${threadId}/messages`,
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
        // ==============================================================


        // Thread Run
        const runRes = await axios.post(
            `https://api.openai.com/v1/threads/${threadId}/runs`,
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

        const runId = runRes.data.id;
        // ==============================================================


        // ✅ Poll run status
        let runStatus = 'queued';
        while (runStatus !== 'completed') {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const pollRes = await axios.get(
                `https://api.openai.com/v1/threads/${threadId}/runs/${runId}`,
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
                throw new Error(`Run ${runStatus}`);
            }
        }
        // ==============================================================

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
        // ==============================================================



        res.status(200).json({
            data: answerRes,
            status: 200
        })

    } catch (error) {
        console.log(error);

        fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
            if (err) throw err;
            console.log('File deleted');
        });

        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
}