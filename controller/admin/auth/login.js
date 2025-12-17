const Admin = require("../../../model/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.login = async (req, res) => {
    try {

        const { username, password } = req.body;

        if (username && password) {
            let findUser = await Admin.findOne({
                where: { username: username }
            });
            if (findUser == null) {
                res.status(401).json({
                    message: "user is not valid",
                    status: 401
                })
            } else {
                const checkPass = await bcrypt.compare(password, findUser.password);
                if (checkPass == true) {
                    const expireTime = Math.floor(Date.now() / 1000) + (60 * 60)
                    const generateToken = await jwt.sign(
                        {
                            data: findUser.id,
                            exp: expireTime,
                        },
                        process.env.ADMIN_AUTH_TOKEN);
                    await Admin.update(
                        { token: generateToken },
                        { where: { id: findUser.id } },
                    )

                    res.status(200).json({
                        message: "login successfully",
                        status: 200,
                        token: generateToken,
                        expireTime: expireTime
                    })
                } else {
                    res.status(401).json({
                        message: "password not match",
                        status: 401
                    })
                }
            }
        } else {
            res.status(401).json({
                message: "Username and password required",
                status: 401
            })
        }
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({
            message: "Something went wrong",
            status: 500
        })
    }
};