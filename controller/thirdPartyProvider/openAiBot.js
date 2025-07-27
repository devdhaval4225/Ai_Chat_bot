const axios = require("axios");
const { checkToken, reduceToken } = require("../../helper/common");

exports.aiBot = async (req, res) => {
    try {
        const { type, threadId, role, content, message } = req.body;
        if (threadId && role && content) {
            if (type === "summarizerBot") {
                let runSummari = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        role: role,
                        content: content
                    }
                });
                runSummari = runSummari.data

                res.status(200).json({
                    data: runSummari
                })

            }

            if (type === "spellCheckerBot") {
                let runSpellChecker = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        role: role,
                        content: content
                    }
                });
                runSpellChecker = runSpellChecker.data

                res.status(200).json({
                    data: runSpellChecker
                })
            }

            if(type === "pdfSummaryBot"){
                let pdfSummary = await axios({
                    url: `https://api.openai.com/v1/threads/${threadId}/messages`,
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
                        'OpenAI-Beta': 'assistants=v2',
                        // 'Content-Type': 'application/json'
                    },
                    data: message
                });
                pdfSummary = pdfSummary.data

                res.status(200).json({
                    data: pdfSummary
                })
            }

        } else {
            res.status(400).json({
                message: "Invalid Input"
            })
        }


    } catch (error) {
        console.log(error.response.data);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};