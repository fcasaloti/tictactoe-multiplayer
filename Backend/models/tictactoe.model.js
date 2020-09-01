//require mongoose
const mongoose = require("mongoose");

//Schema constant
 const Schema = mongoose.Schema;

 //Seeting a new schema up
 const tictactoeSchema = new Schema({
        square: {type: String, required: true},
        squareNumber: {type: Number, required: false},
        stepNumber: {type: Number, required: false},
        location: {type: String, required: false},
        currentStepNumber: {type: Number, required: false},
        xIsNext: {type: Boolean, required: false},
 });

 //Applying the new Schema
 const tictactoeModel = mongoose.model("tictactoeModel", tictactoeSchema);

 //exporting model
 module.exports = tictactoeModel;