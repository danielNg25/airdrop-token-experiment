const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const amountRoute = require("./routes/amount");
dotenv.config();
app.use(express.json());
mongoose
    .connect(process.env.MONGO_URL)
    .then(console.log("Connected to MongoDB"))
    .catch((err) => {
        console.log(err);
    });

app.use("/api/auth", authRoute);
app.use("/api/amount", amountRoute);

app.listen("8000", () => {
    console.log("Server is running!");
});