const AiModel = require("../../../model/aiModel.model");

exports.updateModel = async (req, res) => {
    try {
        const id = req.params.id
        const updateObj = req.body;

        await AiModel.update(
            updateObj,
            {
                where: {
                    id: id
                }
            }
        )
        const findModel = await AiModel.findOne({
            where: {
                id: id
            },
        });

        res.status(200).json({
            data: findModel
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};