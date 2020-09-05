# tictactoe-multiplayer

This is the multiplayer version of the tic-tac-toe application used on https://reactjs.org/tutorial/tutorial.html.

On the frontend, this application has changed in removing the "back in time" buttons, and only informing each step and location for each move.
Also, I inserted highlightings when a square has clicked, and the game is won, besides separate all the components.

The major change is inserting a backend using NodeJS and Express to create a multiplayer game. All moves are stored on the backend to share data among players using different devices.

To run the game in multiplayer mode you may need:

* Execute "npm install" on the backend folder. When all modules have been installed, execute "nodemon index".
* On /frontend/src/game.component.js file, change all the settings pointing from localhost to YOUR IP ADDRESS. This way you can play inside your local network.
* Still on frontend folder, execute "npm install", later on "npm start".
