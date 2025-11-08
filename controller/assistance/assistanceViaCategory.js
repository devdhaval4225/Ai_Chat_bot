const { checkToken, reduceToken } = require("../../helper/common");
const { pick } = require("lodash");
const { getToken } = require("../../config/manageToken");
const Assistant = require("../../model/assistanceModel");


exports.assistanceViaCategory = async (req, res) => {
    try {
        const findAllAssistant = await Assistant.findAll({
            where: {
                isActive: 1
            },
            group: ['category']
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