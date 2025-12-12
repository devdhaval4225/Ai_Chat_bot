const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { _, pick, omit } = require("lodash")
const { getModelToken } = require("../../config/manageToken");
const Model = require("../../model/aiModel.model");
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

exports.uploadConversation = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueid
        const body = req.body
        const { apiProvider, modelId } = body

        const notusedToken = await checkToken(body.deviceId)
        const apiSendUserDetails = pick(notusedToken, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);
        const reminToken = notusedToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            const findModel = await Model.findOne({ where: { modelType: apiProvider, id: Number(modelId) } })
            if (findModel == null) {
                return res.status(400).json({
                    message: "Model Not Found"
                })
            }
            const token = apiSendUserDetails.isSubscribe == 1 ? findModel.dataValues.proToken : findModel.dataValues.token

            if (apiProvider === "openAi") {
                try {
                    const createConver = await axios({
                        url: 'https://api.openai.com/v1/conversations',
                        method: 'post',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            // 'OpenAI-Beta': 'assistants=v2',
                            'Content-Type': 'application/json'
                        },
                        data: {
                            "metadata": { "topic": "demo" }
                        }
                    });
                    const conversationsId = createConver.data.id

                    const form = new FormData();
                    form.append('file', fs.createReadStream(req.file.path),
                    );
                    form.append('purpose', 'vision');

                    let fileUpload = await axios.post('https://api.openai.com/v1/files', form, {
                        headers: {
                            ...form.getHeaders(),
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const fileId = fileUpload.data.id

                    const resObj = {
                        conversationsId: conversationsId,
                        fileId: fileId,
                        userDetails: apiSendUserDetails
                    }

                    res.status(200).json({
                        data: resObj
                    })

                    fs.rm(req.file.path, { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('File deleted successfully');
                        }
                    });
                } catch (error) {
                    console.log("--------Api Error -----", error.response.data.error.message);
                    res.status(400).json({
                        message: error.response.data.error.message
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

            if (apiProvider === "mistralAi") {
                try {

                    const form = new FormData();
                    form.append("file", fs.createReadStream(req.file.path));
                    form.append("purpose", "ocr");

                    let fileUpload = await axios.post('https://api.mistral.ai/v1/files', form, {
                        headers: {
                            ...form.getHeaders(),
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const imageData = fs.readFileSync(req.file.path, { encoding: "base64" });
                    // const fileId = fileUpload.data.id
                    // console.log("---fileId----", fileId)

                    const response = await axios.post(
                        "https://api.mistral.ai/v1/chat/completions",
                        {
                            model: "mistral-large-latest",   // Vision-capable model
                            messages: [
                                {
                                    role: "user",
                                    content: [
                                        { type: "input_text", text: "What do you see in this image?" },
                                        { type: "image_url", image_url: `data:image/jpeg;base64,${imageData}` }
                                    ]
                                }
                            ]
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json"
                            }
                        }
                    );


                    // const chatResp = await axios.post(
                    //     "https://api.mistral.ai/v1/chat/completions",
                    //     {
                    //         model: findModel.dataValues.model,   // a vision-capable model
                    //         messages: [
                    //             {
                    //                 role: "user",
                    //                 content: `Describe the attached image.`,
                    //                 attachments: [
                    //                     {
                    //                         type: "file",
                    //                         id: fileId
                    //                     }
                    //                 ]
                    //             }
                    //         ]
                    //     },
                    //     {
                    //         headers: {
                    //             "Authorization": `Bearer ${token}`,
                    //             "Content-Type": "application/json"
                    //         }
                    //     }
                    // );

                    // console.log("Assistant:", response.data);

                } catch (error) {
                    console.log("--------Api Error -----", error.response.data.detail);
                    res.status(400).json({
                        message: error.response.data.detail
                    })
                }
            }

            if (apiProvider === "gemini") {
                try {
                    const buffer = fs.readFileSync(req.file.path);
                    const base64String = buffer.toString("base64");

                    const response = await axios.post(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${token}`,
                        {
                            contents: [
                                {
                                    role: "user",
                                    parts: [
                                        {
                                            inlineData: {
                                                mimeType: "image/jpeg",
                                                data: base64String,
                                            }
                                        },
                                        { text: "What is in this image?" }
                                    ]
                                }
                            ]
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    res.status(200).json({
                        data: response.data
                    })
                } catch (error) {
                    console.log("--error---",error.response.data.error.message)
                    res.status(400).json({
                        message: error.response.data.error.message
                    })
                }
            }

            if (apiProvider === "deepSeek") {
                try {

                } catch (error) {
                    console.log("--------Api Error -----", error.response.data.error.message);
                    res.status(400).json({
                        message: error.response.data.error.message
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
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
};