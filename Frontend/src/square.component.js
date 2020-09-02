import React from 'react';

//Function that returns each button of the board. Child Component
function Square(props) {
    const fontWeight = props.isSelected ? "bold" : "normal";                //Set Bold to selected square
    const setClass = props.squareWon ? "square line-through" : "square";    //Set class case game is won

    return (
        <td
            className={setClass} style={{ fontWeight: `${fontWeight}` }}
            onClick={props.onClick}
        >
            {props.value}
        </td>
    );
}

export default Square;