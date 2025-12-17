const Assistant = require("../../../model/assistanceModel");

exports.assistance = async (req, res) => {
    try {
        let findAllAssistant = await Assistant.findAll();

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