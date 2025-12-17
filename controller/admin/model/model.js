const AiModel = require("../../../model/aiModel.model");

exports.allModel = async (req, res) => {
    try {

        const findAllModel = await AiModel.findAll({
            order: [['modelName', 'ASC']],
        });

        res.status(200).json({
            data: findAllModel
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};