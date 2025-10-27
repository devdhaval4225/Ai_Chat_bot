require("dotenv").config();
const express = require("express");
// require("./db/redis")
const cors = require("cors")
const app = express();
const cookiesParser = require("cookie-parser");

const port = process.env.PORT || 8000;

app.use(cors());
app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// const {middAuth} = require("./middleware/auth");
// app.use(middAuth)
const {apiLogger} = require("./middleware/apiLogs");
app.use(apiLogger)

const userRoutes = require("./routes/user.routes")
const thirdPartyProvidor = require("./routes/thirdParty.routes");
const subscription = require("./routes/subscription.routes");
app.use("/api/user", userRoutes)
app.use("/api/thirdparty", thirdPartyProvidor)
app.use("/api/plan", subscription)
app.use("/api/manage", require("./routes/manageToken.routes"))

app.listen(port, () => {
    console.log(`Server Running At PORT : ${port}`);
});