const express = require("express");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
const {
    port
} = require("./config/config");

require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
const {
    connection
} = require("mongoose");

app.use(helmet());
app.use(compression());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

connection.once("open", () => {
    app.use("/api/user", require("./api/user"));
    app.use("/api/article", require("./api/article"));

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});