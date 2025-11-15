const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");
const { Sequelize } = require("sequelize");
const AiTool = require("../../model/aitoolModel");

exports.assistanceProvider = async (req, res) => {
    try {
        const id = req.params.id
        if (id.toLowerCase().includes("tool")) {
            const findAllAiTool = await AiTool.findOne({
                where: {
                    isActive: 1,
                    hashId: id
                },
                attributes: [
                    'id',
                    'hashId',
                    'nameAssistant',
                    'category',
                    'imageUrl',
                    'tier',
                    'isLatestFeatures',
                    'isMostFavorite',
                    'isHomeScreen',
                    'question',
                    [Sequelize.literal('1'), 'isTool']   // 👈 static field
                ],
            });

            res.status(200).json({
                data: findAllAiTool
            })
        } else {
            const findAllAssistant = await Assistant.findOne({
                where: {
                    isActive: 1,
                    hashId: id
                },
                attributes: [
                    'id',
                    'hashId',
                    'nameAssistant',
                    'category',
                    'imageUrl',
                    'tier',
                    'isLatestFeatures',
                    'isMostFavorite',
                    'isHomeScreen',
                    'question',
                    [Sequelize.literal('0'), 'isTool']   // 👈 static field
                ],
            });

            res.status(200).json({
                data: findAllAssistant
            })
        }
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};