const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { _, pick, omit } = require("lodash")
const { getModelToken } = require("../../config/manageToken");
const Model = require("../../model/aiModel.model");
let threadId = "thread_123"
const commonFunction = require("../../common/commonFunction");
const AiMediaModel = require("../../model/aiMediaModel.model");
const fs = require("fs");
const path = require("path");

exports.imageCreateProvider = async (req, res) => {
    try {
        const uniqueId = req.headers.uniqueid
        const body = req.body
        const { deviceId, apiProvider, modelId, size, quality } = body
        let updateUserData

        let inputObj = []

        const notusedToken = await checkToken(body.deviceId)
        let apiSendUserDetails = pick(notusedToken, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);
        const reminToken = notusedToken.reminToken
        if (reminToken == 0) {
            res.status(400).json({
                message: "Your Quota is Over"
            })
        } else {
            const findModel = await AiMediaModel.findOne({ where: { id: Number(modelId) } })
            if (findModel == null) {
                return res.status(400).json({
                    message: "Model Not Found"
                })
            }
            const token = apiSendUserDetails.isSubscribe == 1 ? findModel.dataValues.proToken : findModel.dataValues.token
            const model = findModel.dataValues.model
            const rToken = findModel.dataValues.reduceToken

            let resOpenObj = {
                content: {},
                userDetails: apiSendUserDetails
            }
            let imageUrl

            const messObj = await this.apiInputObj(apiProvider, body)
            if (apiProvider === "openAi") {
                try {
                    if (messObj.isBuffer && messObj.isBuffer == true) {

                        let messArr = messObj.obj.filter((v) => v.type == "input_text").map((v) => v.text)
                        messArr = messArr.length > 0  ? messArr.join(",") : "build image"
                        const FormData = require("form-data");
                        const form = new FormData();
                        form.append("model", model);
                        form.append("prompt", messArr);
                        if (body && body.size) { form.append("size", size) }
                        // if (body && body.quality) { form.append("quality", quality) }

                        const imageArr = messObj.obj.filter((v) => v.type == "input_image")
                        if (imageArr.length > 0) {
                            form.append(
                                "image",
                                Buffer.from(imageArr[0]["image_url"].replace(/^data:image\/\w+;base64,/, ""), "base64"),
                                {
                                    filename: `image.png`,
                                    contentType: "image/png",
                                }
                            );
                        }
                        const response = await axios.post(
                            "https://api.openai.com/v1/images/edits",
                            form,
                            {
                                headers: {
                                    ...form.getHeaders(),
                                    Authorization: `Bearer ${token}`,
                                },
                                maxBodyLength: Infinity,
                            }
                        );

                        if (response.data.data[0] && response.data.data[0]["b64_json"]) {
                            const imageOldData = response.data.data[0]["b64_json"]
                            const imageMimeType = response.data["output_format"]
                            imageUrl = await this.imageCreateViaBase(imageOldData, imageMimeType, "openai")
                        } else {
                            imageUrl = response.data.data[0]["url"]
                        }
                        resOpenObj["content"] = { url: imageUrl }
                        res.status(200).json({ data: resOpenObj })

                    } else {
                        const messSecondArr = messObj.obj.filter((v) => v.type == "input_text").map((v) => v.text).join(",")
                        const imageBody = {
                            "model": model,
                            "prompt": messSecondArr,
                            "n": 1,
                        }

                        if (body && body.size) { imageBody["size"] = size }
                        if (body && body.quality) { imageBody["quality"] = quality }

                        const createImg = await axios({
                            url: 'https://api.openai.com/v1/images/generations',
                            method: 'post',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            data: imageBody
                        });
                        await reduceToken(deviceId, uniqueId, apiProvider, "createImageOpenAi", true, rToken);
                        if (createImg.data.data[0] && createImg.data.data[0]["b64_json"]) {
                            const imageData = createImg.data.data[0]["b64_json"]
                            const imageMimeType = createImg.data["output_format"]
                            imageUrl = await this.imageCreateViaBase(imageData, imageMimeType, "openai")
                        } else {
                            imageUrl = createImg.data.data[0]["url"]
                        }
                        resOpenObj["content"] = { url: imageUrl }
                        res.status(200).json({ data: resOpenObj })
                    }

                } catch (error) {
                    res.status(400).json({ message: error.response.data.error.message })
                }
            }

            if (apiProvider === "Gemini") {
                try {
                    const inputObj = {
                        contents: messObj.obj.contents,
                        "generationConfig": { "responseModalities": ["IMAGE"] }
                    };

                    if (body && body.quality) { inputObj["generationConfig"]["imageConfig"] = { imageSize: body.quality } }
                    if (body && body.size) { inputObj["generationConfig"]["imageConfig"] = { aspectRatio: body.size } }

                    let chatCompletions = await axios({
                        url: `https://generativelanguage.googleapis.com/v1beta/models/${model}`,
                        method: 'post',
                        headers: {
                            'x-goog-api-key': token,
                            'Content-Type': 'application/json'
                        },
                        data: inputObj
                    });
                    await reduceToken(deviceId, uniqueId, apiProvider, "createImageGemini", true, rToken);
                    
                    const { mimeType, data } = chatCompletions.data.candidates[0]["content"]["parts"][0]["inlineData"]
                    const imageUrl = await this.imageCreateViaBase(data, mimeType, "gemini")

                    const content = { url: imageUrl }

                    updateUserData = await checkToken(deviceId)
                    const resChatCompletions = {
                        content: content,
                        userDetails: pick(updateUserData, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate'])
                    }

                    res.status(200).json({
                        data: resChatCompletions
                    })
                } catch (error) {
                    console.log("--error---", error.stack)
                    if (error.response.data.error.code === 503) {
                        res.status(503).json({
                            message: "The model is overloaded. Please try again later.",
                        })
                    } else if (error.response.data.error.code === 404) {
                        res.status(400).json({
                            message: error.response.data.error.message,
                        })
                    } else {
                        res.status(400).json({
                            message: error.response.data.error.message,
                        })
                    }
                }

            }

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};

exports.imageCreateViaBase = async (data, mimeType, name) => {
    try {

        // 🔹 Create output directory
        const outputDir = path.join(process.cwd(), "public");
        fs.mkdirSync(outputDir, { recursive: true });

        // 🔹 Determine file extension
        const ext = mimeType.includes('/') ? mimeType.split("/")[1] : mimeType;
        const fileName = `${name}-image-${Date.now()}.${ext}`;
        const filePath = path.join(outputDir, fileName);

        // 🔹 Save image
        const buffer = Buffer.from(data, "base64");
        fs.writeFileSync(filePath, buffer);

        const baseUrl = process.env.NODE_ENV == "production" ? "https://genxai.art/" : "http://localhost:8000/"
        return url = `${baseUrl}public/${fileName}`;
    } catch (error) {
        console.log("---inout creation error ---", error)
    }
};

exports.apiInputObj = async (type, body) => {
    try {
        let finalMessageObj = {}

        let isBuffer = false
        if (type == "openAi") {
            const role = body.message[0]["role"]
            finalMessageObj["role"] = role

            const openMessArr = []
            for (let i = 0; i < body.message.length; i++) {
                let openMessObj = {}

                const type = body.message[i]["type"];
                const text = body.message[i]["text"];
                const imageData = body.message[i]["imageData"];

                if (type == "image") {
                    isBuffer = true
                    openMessObj["type"] = "input_image"
                    openMessObj["image_url"] = imageData
                } else {
                    openMessObj["text"] = text
                    openMessObj["type"] = "input_text"
                }

                openMessArr.push(openMessObj)
                openMessObj = {}
            }
            finalMessageObj = openMessArr
            return { obj: finalMessageObj, isBuffer: isBuffer };

        }

        if (type == "Gemini") {
            const role = body.message[0]["role"]
            // finalMessageObj["role"] = role

            const geminiMessArr = []
            for (let i = 0; i < body.message.length; i++) {
                let geminiMessObj = {}

                const type = body.message[i]["type"];
                const text = body.message[i]["text"];
                const imageData = body.message[i]["imageData"];
                const mimeType = body.message[i]["mimeType"];

                if (type == "image") {
                    isBuffer = true
                    geminiMessObj["inlineData"] = {
                        mime_type: mimeType,
                        data: imageData
                    }
                } else {
                    geminiMessObj["text"] = text
                }
                geminiMessArr.push(geminiMessObj)
                geminiMessObj = {}
            }
            finalMessageObj["contents"] = [{ parts: geminiMessArr }]
            return { obj: finalMessageObj, isBuffer };

        }

    } catch (error) {
        console.log("---input creation error ---", error)
    }
};