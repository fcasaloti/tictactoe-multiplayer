import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './game.component';
import { BrowserRouter as Router, Route } from "react-router-dom";

//React rendering
ReactDOM.render(
    <Router><Route path="/" exact component={Game} /></Router>,
    document.getElementById('root')
);
