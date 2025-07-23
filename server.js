require("dotenv").config({debug: true});
const express = require("express");
// require("./db/redis")
const cors = require("cors")
const app = express();
const cookiesParser = require("cookie-parser");

const port = process.env.PORT || 8000;

app.use(express.urlencoded({extended: false}));
app.use(cookiesParser());
app.use(express.json());
app.use(cors());

const {middAuth} = require("./middleware/auth")
app.use(middAuth)

const userRoutes = require("./routes/user.routes")
const thirdPartyProvidor = require("./routes/thirdParty.routes");
const subscription = require("./routes/subscription.routes");
app.use("/api/user", userRoutes)
app.use("/api/thirdparty", thirdPartyProvidor)
app.use("/api/plan", subscription)

// app.use(function (req, res, next) {
// 	res.status(404).send("Unable to find the requested resource!");
// });

app.listen(port, () => {
    console.log(`Server Running At PORT : ${port}`);
});