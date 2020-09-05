//modules required
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

//setting modules to use
app.use(cors());
app.use(express.json());

//setting route
const tictactoeRouter = require("./routes/tictactoe.routes")
app.use("/game", tictactoeRouter);

//listening port for connection
app.listen(port, () => {
    console.log(`Server running on port >> ${port}`);
});

