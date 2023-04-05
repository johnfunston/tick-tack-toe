//sequence of play:
//you click a button component on the grid. The board hands down a function
//the function nested in Board runs and checks if a winner exists or if a duplicate square is clicked
//if neither conditions are met, we create a shallow copy of the current board-state
//in that copy, which reads [...null] (length=9), we update an index from null to X or O depending on the boolean value in our xIsNext state
//a function, onPlay, is passed down as props from our component and runs passing in our updated shallow copy (nextSquares) as an argument
//when onPlay is called from the board, handlePlay runs inside the Game component
//which appends the recents turn's board-state to the existing history and updates
//whose turn it is

import './styles.css'
import {useState} from 'react'

function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)) { //because our initial square state is null, if the value returns true then we exit the function, or check to see if there is a winner by running a function that returns a value
      return;
    }
    const nextSquares = squares.slice() //create a shallow copy of the current boardstate
    if(xIsNext) { //x has the first turn
      nextSquares[i] = "X"
    } else {
      nextSquares[i] = "O"
    }
    onPlay(nextSquares)
    
  }

  const winner = calculateWinner(squares) //returns either null, X, or O
  let status;
  if (winner) { //if winner is not null
    status = "Winner: " + winner //tell us the value (X or O)
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O") //otherwise tell us whose turn it is
  }

  return (
  <div>
    <div className="status">{status}</div>
    <div className="board-row">
      <Square value={squares[0]} onSquareClick={() => handleClick(0)}/>
      <Square value={squares[1]} onSquareClick={() => handleClick(1)}/>
      <Square value={squares[2]} onSquareClick={() => handleClick(2)}/>
    </div>
    <div className="board-row">
      <Square value={squares[3]} onSquareClick={() => handleClick(3)}/>
      <Square value={squares[4]} onSquareClick={() => handleClick(4)}/>
      <Square value={squares[5]} onSquareClick={() => handleClick(5)}/>
    </div>
    <div className="board-row">
      <Square value={squares[6]} onSquareClick={() => handleClick(6)}/>
      <Square value={squares[7]} onSquareClick={() => handleClick(7)}/>
      <Square value={squares[8]} onSquareClick={() => handleClick(8)}/>
    </div>
  </div>
  )
}

export default function Game() {
  const [currentMove, setCurrentMove] = useState(0)
  const xIsNext = currentMove % 2 === 0;
  const [history, setHistory] = useState([Array(9).fill(null)])
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory) //enumerate the items in history and append the next game-state to the end
    setCurrentMove(nextHistory.length - 1)
  }
  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
    let description
    if (move > 0) {
      description = 'Go to move #' + move
    } else {
      description = 'Go to start'
  }

  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [0, 3, 6],
    [3, 4, 5],
    [6, 7, 8],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i=0; i < lines.length; i++) { //iterate over our array of winning values
    const [a, b, c] = lines[i] //set the values of a,b,c to a winning value
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) //check if the first value, a, has a true value (X or O), then check to see if values b and c are the same as value a
    return squares[a] //if a, b, c share values, give us that value a (which is X or O)
  }
  return null; //if the values don't match, return
}