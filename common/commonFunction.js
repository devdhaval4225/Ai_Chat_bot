const CryptoJS = require("crypto-js");
const axios = require("axios");
const { getToken, getModelToken } = require("../config/manageToken");
const path = require('path');
const fs = require('fs/promises');

exports.uniqueNumber = async (type) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let preFix = ``
    for (let i = 0; i < 10; i++) {
        preFix += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    var newString = ""
    switch (type) {
        case "user":
            newString = `us${preFix}`

            break;

        default:
            break;
    }
    return newString;
}

exports.encrypt = async (text) => {
    const ciphertext = await CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
    return ciphertext;
};

exports.decrypt = async (text) => {
    const bytes = await CryptoJS.AES.decrypt(text, process.env.SECRET_KEY);
    const originalText = await bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

exports.checkModeration = async (text) => {
    try {
        const modelTokens = await getModelToken("openAi");

        // const openAiToken = await getToken('openAi');
        const token = modelTokens.token
        const response = await axios.post(
            "https://api.openai.com/v1/moderations",
            {
                model: "omni-moderation-latest",
                input: text
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        let flagged = response.data.results[0].flagged == false
        if (flagged) {
            if (Number(response.data.results[0]["category_scores"]["sexual"].toFixed(2)) >= 0.3) {
                flagged = true
            } else {
                flagged = false
            }
        } else {
            flagged = true;
        }
        return flagged;
    } catch (error) {
        console.error("Error running moderation:", error.response?.data || error.message);
    }
}

exports.clearUploadsDir = async () => {
    try {
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        const files = await fs.readdir(uploadsDir);

        await Promise.all(
            files.map(file =>
                fs.rm(
                    path.join(uploadsDir, file),
                    { recursive: true, force: true }
                )
            )
        );

        console.log('Uploads directory cleared');
    } catch (err) {
        console.error('Failed to clear uploads directory:', err);
    }
}