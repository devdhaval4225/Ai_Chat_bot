const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");
const { Sequelize } = require("sequelize");

exports.assistanceProvider = async (req, res) => {
    try {
        const id = req.params.id
        const findAllAssistant = await Assistant.findOne({
            where: {
                isActive: 1,
                id: id
            },
            attributes: [
                'id',
                'nameAssistant',
                'category',
                'imageUrl',
                'tier',
                'isLatestFeatures',
                'isMostFavorite',
                [Sequelize.literal("JSON_EXTRACT(question, '$')"), 'question']
            ],
        });

        res.status(200).json({
            data: findAllAssistant
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};