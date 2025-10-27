const TokenModel = require("../../model/manageToken.model");
const { Op } = require("sequelize");

exports.updateToken = async (req,res) => {
    try {
        req.body["deviceId"] = "admin"
        const body = req.body;
        const {
            type,
            isAllSameType,
        } = body;

        const updateObj = {
            token: body.token,
            model: body.model,
            metadata: typeof body.metadata == "string" ? body.metadata : JSON.stringify(body.metadata),
            subscribe_token: body.subscribe_token,
            subscribe_model: body.subscribe_model
        }
        if(type === "openAi" && isAllSameType == true) {

            await TokenModel.update(
                {
                    token: body.token,
                    model: body.model,
                    subscribe_token: body.subscribe_token,
                    subscribe_model: body.subscribe_model
                },
                { 
                    where: { 
                        type: {
                            [Op.like]: 'openAi%'
                        } 
                    } 
                }
            );

        } else {
                        
            if(type === "openAi") {
                await TokenModel.update(
                    updateObj,
                    { where: { type: "openAi" } }
                );
            }

            if(type === "openAichatCompletion") {
                await TokenModel.update(
                    updateObj,
                    { where: { type: "openAichatCompletion" } }
                );
            }
                        
            if(type === "openAi-summarizerBot") {
                await TokenModel.update(
                    updateObj,
                    { where: { type: "openAi-summarizerBot" } }
                );
            }
        
            if(type === "openAi-spellCheckerBot") {
                await TokenModel.update(
                    updateObj,
                    { where: { type: "openAi-spellCheckerBot" } }
                );
            }
        
            if(type === "openAiPdf") {
                await TokenModel.update(
                    updateObj,
                    { where: { type: "openAiPdf" } }
                );
            }
        }

        if(type === "mistralAi") {
            await TokenModel.update(
                updateObj,
                { where: { type: "mistralAi" } }
            );
        }

        if(type === "gemini") {
            await TokenModel.update(
                updateObj,
                { where: { type: "gemini" } }
            );
        }

        if(type === "deepSeek") {
            await TokenModel.update(
                updateObj,
                { where: { type: "deepSeek" } }
            );
        }
        res.status(200).json({
            message: "Updated Succesfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};