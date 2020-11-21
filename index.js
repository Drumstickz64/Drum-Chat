const express = require("express");
const morgan = require("morgan");

const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = 5000;

const app = express();

app.use(express.static("public"));
app.use(morgan(PRODUCTION? "tiny" : "dev"));


app.listen(PORT, () => console.log("connected on port " + 5000));