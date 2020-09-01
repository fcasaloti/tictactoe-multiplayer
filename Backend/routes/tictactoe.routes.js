//Modules required
const router = require("express").Router();
let tictactoe = require("../models/tictactoe.model");
let xIsNext = true;
let stepNumber = 0;

router.route("/").get((req,res) => {
    tictactoe.find()
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/").post((req,res) => {
    stepNumber = (stepNumber >= 8 ? 0 : stepNumber + 1);
    const square = xIsNext ? 'X' : 'O';
    const squareNumber= req.body.squareNumber;
    
    const locationMap = [
        'row 1, col 1', 'row 1, col 2', 'row 1, col 3',
        'row 2, col 1', 'row 2, col 2', 'row 2, col 3',
        'row 3, col 1', 'row 3, col 2', 'row 3, col 3',
    ];
    const location = locationMap[squareNumber];
    const currentStepNumber = stepNumber;
    xIsNext = !xIsNext;

    const newMove = new tictactoe({
        square,
        squareNumber,
        stepNumber,
        location,
        currentStepNumber,
        xIsNext,
    })

    console.log (newMove)
    newMove
        .save()
        .then(() => res.json(newMove))
        .catch((err) => res.status(400).json("Error= " + err));

})

//exporting router
module.exports = router;