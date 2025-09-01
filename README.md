# Chess_1v1

Real-Time Online Chess Game
A classic two-player chess game built to run in the browser, featuring real-time multiplayer gameplay powered by Node.js and Socket.IO.
This project demonstrates a full-stack application structure using a Node.js backend to manage game logic and state, while the frontend provides a clean, interactive user interface for players.

✨ Features
Real-Time Multiplayer: Play against another person live in your browser.
Automatic Role Assignment: The first player to connect is assigned White, the second is assigned Black.
Spectator Mode: Any additional users who join can watch the game in real-time without interfering.
Correct Player Perspective: The board automatically flips 180 degrees for the player assigned Black.
Intuitive Drag-and-Drop: Move pieces easily by dragging them from their source square to a target square.
Server-Side Move Validation: All moves are validated on the server using the chess.js library to ensure they comply with the rules of chess.
Clean & Simple UI: A minimalist design using Tailwind CSS that keeps the focus on the game.

🛠️ Technologies Used
Backend
Node.js: JavaScript runtime for the server.
Express.js: Web application framework for handling HTTP requests and routing.
Socket.IO: Library for enabling real-time, bidirectional event-based communication.
Chess.js: A powerful JavaScript library for chess move generation, validation, and game state management.
EJS: Embedded JavaScript templating for rendering the main HTML page.
Frontend
HTML5 & CSS3: For structuring and styling the webpage.
JavaScript (ES6): For client-side logic and DOM manipulation.
Tailwind CSS: A utility-first CSS framework for styling.
Socket.IO Client: To connect the browser to the real-time server.

🚀 Getting Started
Follow these instructions to get a local copy up and running.
Prerequisites
You must have Node.js and npm installed on your machine.
Installation & Setup
Clone the repository:
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)


Navigate to the project directory:
cd your-repo-name


Install NPM packages:
npm install


Start the server:
node app.js

You should see a confirmation message in your terminal: listening on 3000.

🎮 How to Play
After starting the server, open your web browser and navigate to http://localhost:3000. This will be Player 1 (White).
Open a second browser tab or window (or a different browser) and go to the same address, http://localhost:3000. This will be Player 2 (Black). The board in this window will be flipped.
The game is now ready to play! White moves first.
Any other browser tabs opened to the same address will be assigned the spectator role. They will see the game progress in real-time but will be unable to move the pieces.

📂 Project Structure
.
├── public/
│   └── js/
│       └── chessgame.js    # Client-side game logic and UI
├── views/
│   └── index.ejs           # EJS template for the main HTML page
├── app.js                  # Main server file (Express & Socket.IO logic)
├── package.json            # Project dependencies
└── README.md               # You are here!


📝 Future Improvements
Implement a player chat system.
Keep track of captured pieces.
Add a "Game Over" screen for checkmate or stalemate.
Allow players to create game rooms with unique IDs.
Display game history using algebraic notation.
