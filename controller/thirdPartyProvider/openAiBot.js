const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");

exports.aiBot = async (req, res) => {
    try {
        const summarizerBotToken = await getToken('openAi-summarizerBot');
        const spellCheckerBotToken = await getToken('openAi-spellCheckerBot');
        
        const { type, threadId, role, content, message, deviceId } = req.body;
        const header = req.headers
        const uniqueId = header['uniqueid'];
        const userDetails = await checkToken(req.body.deviceId)
        const apiSendUserDetails = pick(userDetails, ['id', 'totalToken', 'usedToken', 'reminToken', 'planType', 'isSubscribe', 'expireDate']);

        // await reduceToken(deviceId, uniqueId, "Bot", type, true)

        if (threadId && role && content) {
            if (type === "summarizerBot") {
                let runSummari = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${summarizerBotToken.token}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        role: role,
                        content: content
                    }
                });

                const pickRunSummari = pick(runSummari.data, ['id', 'content'])
                pickRunSummari.content = pickRunSummari.content.map(c => ({ text: pick(c.text, ['value']), type: c.type }));
                runSummari = pickRunSummari

                runSummari["userDetails"] = apiSendUserDetails

                res.status(200).json({
                    data: runSummari
                })

            }

            if (type === "spellCheckerBot") {
                let runSpellChecker = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${spellCheckerBotToken.token}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        role: role,
                        content: content
                    }
                });

                const pickSpellChecker = pick(runSpellChecker.data, ['id', 'content'])
                pickSpellChecker.content = pickSpellChecker.content.map(c => ({ text: pick(c.text, ['value']), type: c.type }));
                runSpellChecker = pickSpellChecker
                runSpellChecker["userDetails"] = apiSendUserDetails

                res.status(200).json({
                    data: runSpellChecker
                })
            }

        } else {
            res.status(400).json({
                message: "Invalid Input"
            })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};