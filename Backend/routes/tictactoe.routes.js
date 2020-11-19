//module required
const router = require("express").Router();

//setting variable to store "state" data from clients
let state = {
    squares: Array(9).fill(null),
    stepNumber: 0,
    xIsNext: true,
    squareNum: "",
    history: [{
        stepNumber: 0,
        xIsNext: true,
        squareNum: "",
    }],
}

//setting route to send "state" data to clients
router.route("/").get((request,response) => {
    
    const sendData = getData();
    response.send(sendData);   
    console.log(sendData);  //debug

});

//function returning "state" data
function getData(){
    return state;
}

//setting route to receive data from clients and store in "state" variable
router.route("/").post((request,response) => {

    state = {
        squares: request.body.squares.slice(),
        stepNumber: request.body.stepNumber,
        xIsNext: request.body.xIsNext,
        squareNum: request.body.squareNum,
        history: request.body.history.slice(),
    }

    response.json(state);
    console.log(state);     //debug
})

//route created to reset data of the state variable
router.route("/").delete((request,response)=> {
    state = {
        squares: Array(9).fill(null),
        stepNumber: 0,
        xIsNext: true,
        squareNum: "",
        history: [{
            stepNumber: 0,
            xIsNext: true,
            squareNum: "",
        }],
    }

    response.json("reset done");
    console.log("reset done");

})

//exporting router
module.exports = router;