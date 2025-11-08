const CryptoJS = require("crypto-js");


exports.uniqueNumber = async (type) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let preFix = ``
    for (let i = 0; i < 10; i++) {
        preFix += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    var newString = ""
    switch (type) {
        case "user":
            newString = `us${preFix}`

            break;

        default:
            break;
    }
    return newString;
}

exports.encrypt = async (text) => {
    const ciphertext = await CryptoJS.AES.encrypt(text, process.env.SECRET_KEY).toString();
    return ciphertext;
};

exports.decrypt = async (text) => {
    const bytes  = await CryptoJS.AES.decrypt(text, process.env.SECRET_KEY);
    const originalText = await bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};