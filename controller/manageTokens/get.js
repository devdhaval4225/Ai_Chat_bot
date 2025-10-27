const TokenModel = require("../../model/manageToken.model");
const { Op } = require("sequelize");

exports.tokenAndModel = async (req,res) => {
    try {
        const body = req.body;
        
        let config = body && body.type && body.type.length > 0 ? 

        await TokenModel.findAll({ 
            where: { 
                type: {
                    [Op.like]: `%${body.type}%`
                } 
            } 
        }) :
        await TokenModel.findAll();
    
        res.status(200).json({
            data: config
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};