const { checkToken, reduceToken } = require("../../helper/common");
const { pick, groupBy } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");



exports.assistanceViaCategory = async (req, res) => {
    try {
        let findAllAssistant = await Assistant.findAll({
            where: { isActive: 1 },
            attributes: [
                'id',
                'hashId',
                'nameAssistant',
                'category',
                'imageUrl',
                'tier',
                'isLatestFeatures',
                'isMostFavorite',
                'isActive',
                'isHomeScreen',
            ],
            order: [['category', 'ASC'], ['id', 'ASC']], // optional sorting
            raw: true,
        });
        findAllAssistant = groupBy(findAllAssistant, "category");




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