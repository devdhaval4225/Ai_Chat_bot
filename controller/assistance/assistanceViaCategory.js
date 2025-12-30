const { checkToken, reduceToken } = require("../../helper/common");
const { pick, groupBy } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");
const sequelize = require("../../db/connection");



exports.assistanceViaCategory = async (req, res) => {
    try {
        // let findAllAssistant = await Assistant.findAll({
        //     where: { isActive: 1 },
        //     attributes: [
        //         'id',
        //         'hashId',
        //         'nameAssistant',
        //         'category',
        //         'imageUrl',
        //         'tier',
        //         'isLatestFeatures',
        //         'isMostFavorite',
        //         'isActive',
        //         'isHomeScreen',
        //     ],
        //     order: [['category', 'ASC'], ['id', 'ASC']], // optional sorting
        //     raw: true,
        // });
        // findAllAssistant = groupBy(findAllAssistant, "category");


        let [rows] = await sequelize.query(`
            SELECT 
                id,
                hashId COLLATE utf8mb4_unicode_ci AS hashId,
                nameAssistant COLLATE utf8mb4_unicode_ci AS nameAssistant,
                category COLLATE utf8mb4_unicode_ci AS category,
                imageUrl COLLATE utf8mb4_unicode_ci AS imageUrl,
                tier COLLATE utf8mb4_unicode_ci AS tier,
                isLatestFeatures,
                isMostFavorite,
                isActive,
                isHomeScreen,
                FALSE AS isTool,
                type,
                character_category
            FROM assistant
            WHERE isActive = 1

            UNION ALL

            SELECT 
                id,
                hashId COLLATE utf8mb4_unicode_ci AS hashId,
                nameAssistant COLLATE utf8mb4_unicode_ci AS nameAssistant,
                category COLLATE utf8mb4_unicode_ci AS category,
                imageUrl COLLATE utf8mb4_unicode_ci AS imageUrl,
                tier COLLATE utf8mb4_unicode_ci AS tier,
                isLatestFeatures,
                isMostFavorite,
                isActive,
                isHomeScreen,
                TRUE AS isTool,
                'assistant' AS type,
                'default' AS character_category
            FROM aiTool
            WHERE isActive = 1

            ORDER BY category ASC, id ASC;
        `);
        rows = groupBy(rows, "category");



        res.status(200).json({
            data: rows
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};