import Cell from "./Cell";

class Board {

    static SIZE = 9

    #board

    constructor(boardString = null, readOnly = true) {
        const board = new Array(Board.SIZE)

        for (let i = 0; i < Board.SIZE; i++) {
            board[i] = new Array(Board.SIZE)
        }

        if (boardString === null) {
            for (let row = 0; row < Board.SIZE; row++) {
                for (let col = 0; col < Board.SIZE; col++) {
                    board[row][col] = new Cell(row, col, undefined , false)
                }
            }
        } else {
            for (let row = 0; row < Board.SIZE; row++) {
                for (let col = 0; col < Board.SIZE; col++) {
                    const current = boardString[row][col]
                    if (current !== Cell.EMPTY) {
                        board[row][col] = new Cell(row, col, current, readOnly)
                    } else {
                        board[row][col] = new Cell(row, col, current, false)
                    }
                }
            }
        }
        this.#board = board

    }

    getBoard = () => {
        return this.#board
    }

    getBoardString = () => {
        const board = new Array(Board.SIZE)

        for (let i = 0; i < Board.SIZE; i++) {
            board[i] = new Array(Board.SIZE)
        }
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                board[row][col] = this.#board[row][col].getValue().toString()
            }
        }
        return board
    }

    getCell = (row, col) => {
        return this.#board[row][col]
    }


    editCell = (row, col, value, readOnly = false) => {
        this.#board[row][col] = new Cell(row, col, value, readOnly)
    }

    editAllCells = (board) => {
        for (let row = 0; row < Board.SIZE; row++) {
           for (let col = 0; col < Board.SIZE; col++) {
               this.editCell(row, col, board[row][col])
           }
        }
    }

    clearNonReadOnlyCells = () => {
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                if (!this.#board[row][col].getReadOnly()) {
                    this.editCell(row, col,".")
                }
            }
        }
    }

    correctAllReadOnlyCell = () => {
        for (let row = 0; row < Board.SIZE; row++) {
            for (let col = 0; col < Board.SIZE; col++) {
                if (!this.#board[row][col].getReadOnly()) {
                    this.#board[row][col].setWrong(false)
                }
            }
        }
    }



}
export default Board