const AiTool = require("../../../model/aitoolModel");

exports.tools = async (req, res) => {
    try {
        let findAllTool = await AiTool.findAll();

        res.status(200).json({
            data: findAllTool
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};