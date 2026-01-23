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
                'featuresType',
                // 'model',
                'imageUrl',
                'thumbnail',
                'isPro',
                'isActive',
                // 'token',
                // 'proToken',
                // 'reduceToken'
            ],
            order: [['modelName', 'ASC']],
             raw: true
        });

        // Ensure backward compatibility: modelType should contain the category (aiVideo etc.)
        const formattedModels = findAllMediaModel.map(item => {
            return {
                ...item,
                modelType: item.featuresType || item.modelType || 'other'
            };
        });

        res.status(200).json({
            // data: findAllMediaModel
            data: formattedModels
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
        const findAllMediaFeature = await AiMediaFeature.findAll({
            where: {
                isActive: true,
            },
            attributes: [
                'id',
                'hashId',
                'name',
                'modelType',
                'featuresType',
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

        
         // Transform keys to camelCase for consistent API response format
         // Map data: ensure modelType contains the category for app support
        const formattedFeatures = findAllMediaFeature.map(item => {
            const category = item.featuresType || item.modelType || 'other';
            return {
                ...item,
                modelType: category 
            };
        });

        // Grouping logic: group by the category name (e.g. aiVideo, aiImage)
        const groupedFeatures = {};
         formattedFeatures.forEach(item => {
            const key = item.modelType; 
            if (!groupedFeatures[key]) {
                groupedFeatures[key] = [];
            }
            groupedFeatures[key].push(item);
        });

        res.status(200).json({
            data: groupedFeatures
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
