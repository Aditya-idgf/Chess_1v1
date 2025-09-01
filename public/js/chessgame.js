// const { Chess } = require("chess.js");

// this is front-end that is client/browser side
const socket = io();

// socket.emit('client_message') // emit means sending data, we are sending data from browser to server
// socket.on('server_message', ()=>{
    //     console.log('server_message : recieved'); // this will be printed in the browsers console
    // })
    
document.addEventListener('DOMContentLoaded', () => {
    const chess = new Chess()
    const boardElement = document.querySelector('.chessboard')
    
    let draggedPiece = null;
    let sourceSquare = null;
    let playerRole = null;
    
    const getPiece = (piece) => {
        const unicodePieces = {
            p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
            P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
        };
        return unicodePieces[piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()] || "";
    }
    
    const handleMove = (source, target) => {
        const move = {
            from: `${String.fromCharCode(97+ source.col)}${8 - source.row}`,
            to:`${String.fromCharCode(97+ target.col)}${8 - target.row}`,
            promotion: "q"
        }
        console.log("Move from", source, "to", target);

        socket.emit('move', move)
    }
         
    const renderBoard = () => {
        let board = chess.board(); // here board is a array of array (matrix)
        boardElement.innerHTML = "" // clearing the chess board everytime
        board.forEach((row, rowindex) => { // traversing over all rows
            // console.log(row, rowindex);
            row.forEach((square, squareindex) => { // traversing over all values in that row
                // console.log(square);
                const squareElement = document.createElement('div') // for each value we dynamically created a div
                squareElement.classList.add(
                    'square', // gave that div a class 'square'
                    ((rowindex + squareindex) % 2 === 0 ? 'light' : 'dark') // assigning color to that div
                )
                squareElement.dataset.row = rowindex; // every square has been assigned a value (rowindex, squareElement)
                squareElement.dataset.col = squareindex;
                
                if(square) {    // if that square has a piece on it 
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece', square.color === 'w' ? 'white' : 'black')
                    pieceElement.innerText = getPiece(square); // these values will be assigned using getPiece()
                    pieceElement.draggable = playerRole === square.color;

                    pieceElement.addEventListener('dragstart', (event) => {
                        if(pieceElement.draggable) {
                            draggedPiece = pieceElement;
                            sourceSquare = {row: rowindex, col: squareindex}
                            event.dataTransfer.setData('text/plain', ""); 
                        }
                    })
                    
                    pieceElement.addEventListener('dragend', () => {
                        draggedPiece = null
                        sourceSquare = null
                    })
                    
                    squareElement.append(pieceElement);
                }

                squareElement.addEventListener('dragover', (e) => e.preventDefault())     // cant forcefully drag any square
                
                
                squareElement.addEventListener('drop', (e) => {
                    e.preventDefault();
                    if(draggedPiece) {
                        const targetSource = {
                            row: parseInt(squareElement.dataset.row),
                            col: parseInt(squareElement.dataset.col)
                        }
                        
                        handleMove(sourceSquare, targetSource);
                    }
                })
                
                boardElement.appendChild(squareElement);          
            })
        })    

        if(playerRole === 'b') {
            boardElement.classList.add('flipped')
        } else {
            boardElement.classList.remove('flipped')
        }
    }
    
    renderBoard()
    
    socket.on('playerRole', (role) => {
        playerRole = role;
        renderBoard()
    })

    socket.on('spectatorRole', () => {
        playerRole = null;
        renderBoard();
    })

    socket.on('boardState', (fen) => {
        chess.load(fen)
        renderBoard()
    })

    socket.on('move', (move) => {
        chess.move(move)
        renderBoard()
    })

})

