const AWS = require("aws-sdk");
const path = require('path');
const fs = require('fs');
const { clearUploadsDir } = require("../../../common/commonFunction");

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3Client = new AWS.S3();

exports.uploadImageToS3 = async (req, res) => {
    try {
        const bucketName = "genxai-images";

        const folderName = "ZapAi Ai Assistances Thumb Images JPG 1024kb";

        const key = `${folderName}/${req.file.originalname}`;

        const buffer = fs.createReadStream(req.file.path)
        const mimetype = req.file.mimetype

        await s3Client
            .putObject({
                Bucket: bucketName,
                Key: key,
                Body: buffer,
                ContentType: mimetype,
            })
            .promise();

        // // Encode key to match your required URL format
        const encodedKey = encodeURIComponent(key).replace(/%20/g, "+");

        const imageUrl = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${encodedKey}`;
        res.status(200).json({
            url: imageUrl
        })
        await clearUploadsDir();
    } catch (error) {
        await clearUploadsDir();
        console.log("----error---", error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}
