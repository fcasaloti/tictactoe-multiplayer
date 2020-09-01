//modules required
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//App use
app.use(cors());
app.use(express.json());

//setting connection with mongoose
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.on("open", () => {
    console.log("MongoDB database connection established successfully");
})

//setting routes
const tictactoeRouter = require("./routes/tictactoe.routes")
app.use("/game", tictactoeRouter);

//Listening
app.listen(port, () => {
    console.log(`Server running on port >> ${port}`);
});

