const express = require("express");
const morgan = require("morgan");

const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = 5000;

const app = express();

app.use(morgan(PRODUCTION? "tiny" : "dev"));
app.use(express.static("public"));


app.listen(PORT, () => console.log("connected on port " + 5000));