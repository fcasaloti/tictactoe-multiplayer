import React from 'react';
import Board from './board.component';
import Switch from './switch.component';
//import {Link} from 'react-router-dom';
import axios from 'axios';

//Game class. Parent component.
export default class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                stepNumber: "",
                location: "",
            }],
            currentStepNumber: 0,
            xIsNext: true,
            isReversed: false,
        };
    }
    
    //Set interval for refresh
    intervalID;

    //Mount after rendering
    componentDidMount(){

        this.getData();
        this.intervalID = setInterval(this.getData.bind(this), 1000);

    }

    //Get data from the server
    getData = () => {
        axios.get('http://192.168.1.65:5000/game/')
            .then(response => {
                console.log(response.data);   //debug
                this.setBoard(response.data)

            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    //Unmount case unload the component
    componentWillUnmount() {

        clearInterval(this.intervalID);

      }
 
    //Set data on board
    setBoard(board){
        let history = [{
            squares: Array(9).fill(null),
            stepNumber: "",
            location: ""
        }];

        let squares = Array(9).fill(null);

        for (let i = 0; i < board.length; i++){
            for (let z = 0; z < 9; z++){
                if (board[i].squareNumber === z){
                    squares[z] = board[i].square;
                    history[i + 1] = {
                        squares: squares.slice(),
                        stepNumber: board[i].stepNumber,
                        location: board[i].location,
                     }
                    break;
                }
            }
        }

        const current = board.length - 1;

        this.setState({
            history: history.slice(),
            currentStepNumber: board[current].currentStepNumber,
            xIsNext: board[current].xIsNext, 
        })
    }

    //Function handling user clicks.
    handleClick(i) {

        const squareNumber = {
            "squareNumber": i        
        }

        const history = this.state.history.slice(0, this.state.currentStepNumber + 1);

        const currentSquares = history[history.length - 1];
        const squares = currentSquares.squares.slice();
        console.log(squares[i])

        //Check whether is already won and does not allow next player click on the same square
        if (calculateWinner(squares) || squares[i]) {
            return
            ;
        }

        axios.post("http://192.168.1.65:5000/game", squareNumber)
        .then((res) => {
            this.getData();
        });

     }

    //Function used to "back in time".
    jumpTo(step) {
        this.setState({
            currentStepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    //Function used to reverse buttons order
    reverseButtons() {
        this.setState({
          isReversed: !this.state.isReversed,
        });
      }

      initialState = () => {
        this.setState = {
            history: [{
                squares: Array(9).fill(null),
                stepNumber: "",
                location: "",
            }],
            currentStepNumber: 0,
            xIsNext: true,
            isReversed: false,
        };
        console.log("cleaned")
      }

      cleanBoard = () => {
        axios.delete('http://192.168.1.65:5000/game/')
            .then(response => {
                this.initialState();
                window.location = "/";

            })
            .catch((error) => {
                console.log(error);
            })
    }

    //Rendering Game component
    render() {
        console.log('game rendered');
        const history = this.state.history; 
        const current = history[this.state.currentStepNumber];
        const winnerSquares = calculateWinner(current.squares);
        let winnerPlayer = [];
        let status;
        //Check status of the game
        if (winnerSquares) {
            winnerPlayer = current.squares[winnerSquares[0]];
            status = 'Winner: ' + winnerPlayer;
        }
        else if (this.state.currentStepNumber === 9)
            status = 'Drawn game';
        else 
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        //Looping used to create "back in time" buttons
        const moves = history.map((step, move) => {
            const desc = step.stepNumber ?
                'Go to move #' + step.stepNumber + ' in ' + step.location :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        className="button"
                        onClick={() => this.jumpTo(move)}
                    >{desc}</button>
                </li>
            );
        });

        //Rendering game
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winnerSquares={winnerSquares}
                    />
                </div>
                <div className="game-info">
                    <button className="button" onClick={() => this.cleanBoard()}>Clean Board</button>
                </div>
                <div className="game-info">
                    <span>Reverse</span>
                    <Switch className="button"
                        handleToggle={() => this.reverseButtons()}
                    />
                    <hr></hr>
                    <div className="status">{status}</div>
                    <hr></hr>
                    <ol className={this.state.isReversed ? "reversed" : ""}>{moves}</ol>
                </div>
            </div>
        );
    }
}

//Function used to calculate the winner of the game
function calculateWinner(squares) {
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