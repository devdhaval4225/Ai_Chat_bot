const AiMediaModel = require("../../model/aiMediaModel.model");
const AiMediaFeature = require("../../model/aiMediaFeature.model");
const { groupBy } = require("lodash");

exports.mediaModelProvider = async (req, res) => {
    try {
        const findAllMediaModel = await AiMediaModel.findAll({
            where: {
                isActive: 1,
            },
            attributes: [
                'id',
                'modelName',
                'modelType',
                'model',
                'imageUrl',
                'thumbnail',
                'isPro',
                'isActive',
                'token',
                'proToken',
                'reduceToken'
            ],
            order: [['modelName', 'ASC']],
        });

        res.status(200).json({
            data: findAllMediaModel
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};

exports.mediaFeatureProvider = async (req, res) => {
    try {
        let findAllMediaFeature = await AiMediaFeature.findAll({
            where: {
                isActive: true,
            },
            attributes: [
                'id',
                'hashId',
                'name',
                'modelType',
                'model',
                'prompt',
                'imageSource',
                'thumbnailSource',
                'defaultUserImage',
                'imageRatio',
                'imageResolution',
                'isActive',
                'position'
            ],
            order: [['position', 'ASC'], ['createdAt', 'DESC']],
            raw: true
        });

        // Grouping logic matching old patterns if needed
        findAllMediaFeature = groupBy(findAllMediaFeature, "modelType");

        res.status(200).json({
            data: findAllMediaFeature
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};

exports.addMediaModel = async (req, res) => {
    try {
        const newData = await AiMediaModel.create(req.body);
        res.status(201).json({
            message: "Media Model Added Successfully!",
            data: newData
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500,
            error: error.message
        })
    }
};

exports.addMediaFeature = async (req, res) => {
    try {
        const newData = await AiMediaFeature.create(req.body);
        res.status(201).json({
            message: "Media Feature Added Successfully!",
            data: newData
        })
    } catch (error) {
        console.log("---error---", error)
        res.status(500).json({
            message: "Something went wrong",
            status: 500,
            error: error.message
        })
    }
};
