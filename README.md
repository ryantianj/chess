# User Guide

## Quick start
1. Ensure that you have enabled Javascript on your browser (enabled by default)
2. Ensure that you allow service workers (enabled by default)

## Features

### All chess moves

This app supports:
1. Normal piece movement
2. Castling (queen and king side)
3. En passant
4. Pawn promotion

### Play with your friends
Start playing anytime by making a move with white

### Computer AI
Play against my handwritten AI, higher depths result in higher difficulty, and more time taken for the AI to make a move (maximum of 20 seconds)
* Press the "Engine On" button to play against the AI

#### AI details
In case you are curious:
1. Alpha-beta pruning
2. Quiescence search
3. Killer heuristic
4. Principal variation
5. Move ordering (MVV-LVA, PV)
6. Null move heuristic
7. Iterative deepening
8. Dynamic piece square tables (based on game phase / pieces on board)

AI runs on a separate thread in the background (web worker, single thread)

I update the AI from time to time, stay tuned!

### Other features
1. Undo button available for depth 2 and player vs player mode only
2. View past moves in algebraic notation
3. Move timer (accurate to the nearest second)
4. View legal moves - by clicking on a piece or dragging a piece
5. Colors - View which piece moved and from where

View my other projects [here](https://ryantianj.github.io/personal-site/)
