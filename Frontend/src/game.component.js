//importing modules
import React from 'react';
import Board from './board.component';
import axios from 'axios';

//constant used to set initial data to "state"
const initialState = {
    squares: Array(9).fill(null),
    stepNumber: 0,
    xIsNext: true,
    squareNum: '',
    history: [{
        stepNumber: 0,
        xIsNext: true,
        squareNum: '',
    }],
}

//Input here your local IP or type "localhost"
const myIp = "192.168.1.65";

//constant used to create list of moves during the game
const Move = (props) => {

    const locationMap = [
        'row 1, col 1', 'row 1, col 2', 'row 1, col 3',
        'row 2, col 1', 'row 2, col 2', 'row 2, col 3',
        'row 3, col 1', 'row 3, col 2', 'row 3, col 3',
    ]

    const moves = props.history.map((step,move)=> {
        const location = step.stepNumber !== 0 ?
            'Player ' + (step.xIsNext ? "O" : "X") + " clicked on " + locationMap[step.squareNum] :
            "Game Start";
            return(
                <li key={move}>{location}</li>
            )
    })
    return moves;
}

//Game class. Parent component.
export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: initialState.squares,
            stepNumber: initialState.stepNumber,
            xIsNext: initialState.xIsNext,
            squareNum: initialState.squareNum,
            history: initialState.history,
        };
    }

    //set interval for refresh data
    intervalID;

    //component used to get data from the backend when page is loaded
    componentDidMount(){
        this.getData();
        this.intervalID = setInterval(this.getData.bind(this),1000);
    }

    //get data from the backend and set response in "state"
    getData(){
        axios.get('http://' + myIp + ':5000/game/')
            .then(response => {
                //console.log(response.data); //debug
                this.setState(response.data);
            })
    }

    //clear interval refresh when components is unloaded
    componentWillUnmount(){
        clearInterval(this.intervalID);
    }

    //function handling clicks on squares
    handleClick(i){

        let squares = this.state.squares.slice();
        const calculateWinner = this.calculateWinner(squares);

        if (!squares[i] && !calculateWinner){
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            
        const game = {
            squares:squares,
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext,
            squareNum: i,
        }

        this.checkWinner(game);
        this.newState(game);

        this.postState(game);
        }
    };

    //function sending updated data to backend when a square is clicked
    postState(game){
        const updatedState = this.newState(game);
        axios.post('http://' + myIp + ':5000/game/', updatedState)
            .then((response) => {
                //console.log(response.data)    //debug
            })
    }

    //function used to created status message on top of the game
    checkWinner(squares){
        const winnerSquares = this.calculateWinner(squares);
        let winnerPlayer;
        let status;

        if (winnerSquares) {
            winnerPlayer = squares[winnerSquares[0]];
            status = 'Winner: ' + winnerPlayer;
        }
        else if (this.state.stepNumber === 0)
        status = 'Lets begin!';
        else if (this.state.stepNumber === 9)
            status = 'Drawn game';
        else 
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        return status;
    }
    
    //function setting new state when a square is clicked
    newState(game){

        const state = {
            squares: game.squares,
            stepNumber: game.stepNumber,
            xIsNext: game.xIsNext,
            squareNum: game.squareNum,
            history: this.state.history.concat([{
                stepNumber: game.stepNumber,
                xIsNext: game.xIsNext,
                squareNum: game.squareNum,
            }]),
        }

        this.setState({
            squares: state.squares,
            stepNumber: state.stepNumber,
            xIsNext: state.xIsNext,
            squareNum: state.squareNum,
            history: this.state.history.concat([{
                stepNumber: state.stepNumber,
                xIsNext: state.xIsNext,
                squareNum: state.squareNum,
            }]),
        })
        return state;
    };

    //function used to reset the state of the game on client when Reset is clicked
    resetGame(){
        this.setState({
            squares: initialState.squares,
            stepNumber: initialState.stepNumber,
            xIsNext: initialState.xIsNext,
            squareNum: initialState.squareNum,
            history: [{
                stepNumber: 0,
                xIsNext: true,
                squareNum: '',
            }],
        })
        this.sendReset();
    }

    //function used to reset the state of the game on backend when Reset is clicked
    sendReset = () => {
        axios.delete('http://' + myIp + ':5000/game/')
            .then(response => {
                console.log(response);

            })
            .catch((error) => {
                console.log(error);
            })
    }

    //Function used to calculate the winner of the game
    calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
        }
    }
    return null;
}

    //Rendering Game component
    render() {
        console.log('game rendered');
        //Rendering game
        return (
            <div className="game">
                <table className="game-board">
                    <tbody>
                        <Board
                            squares={this.state.squares}
                            onClick={(i) => this.handleClick(i)}
                            winnerSquares={this.calculateWinner(this.state.squares)}
                            squareNum={this.state.squareNum}
                        />
                    </tbody>
                </table>
                <div className="description">
                    <div className="game-info">
                        <div className="status">{this.checkWinner(this.state.squares)}</div>
                        <hr></hr>
                    </div>
                    <div className="button">
                        <button className="reset" onClick={() => this.resetGame()}>Reset</button>
                        <br></br>
                    </div>
                    <div>
                        <ol className="moves" start="0">
                            <Move
                                history={this.state.history}
                            />
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}