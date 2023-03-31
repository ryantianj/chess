import random
import sys


### IMPORTANT: Remove any print() functions or rename any print functions/variables/string when submitting on CodePost
### The autograder will not run if it detects any print function.

# Helper functions to aid in your implementation. Can edit/remove
#############################################################################
######## Piece
#############################################################################
import time


class Piece:
    # subclass for each piece
    # function listValidMoves (attacking squares) input: current coordinate, board output: list of tuples of valid moves
    # function addAttackingSquaresToBoard (add squares piece is attacking to the board (marked as -2))
    def __init__(self, piece):
        self.xCoord = piece[0][1]
        self.yCoord = piece[0][0]
        self.pieceName = piece[1][0]
        self.pieceColor = piece[1][1]
        self.piece = piece

    def add_piece_to_board(self, board):
        if board[self.yCoord][self.xCoord] != 0:
            return board
        board[self.yCoord][self.xCoord] = self
        return board

    def transition(self, action):
        new_obj = instantiate_piece(self.piece)
        new_obj.xCoord = action[1]
        new_obj.yCoord = action[0]
        return new_obj

    # 1 - 8
    def one_step_any_direction_move(self, board, rows, cols, x, y):
        if 0 <= self.xCoord + x < cols and 0 <= self.yCoord + y < rows:
            current_board = board[self.yCoord + y][self.xCoord + x]
            if isinstance(current_board, Piece):
                if current_board.pieceColor != self.pieceColor:
                    return [((self.yCoord + y, self.xCoord + x), current_board, self, (self.yCoord, self.xCoord))]
                else:
                    return []
            return [((self.yCoord + y, self.xCoord + x), None, self, (self.yCoord, self.xCoord))]
        return []

    # 9 - 16
    def many_steps_any_direction_move(self, board, rows, cols, x, y):
        moves = []
        currentX = self.xCoord
        currentY = self.yCoord
        while 0 <= currentX + x < cols and 0 <= currentY + y < rows:
            current_board = board[currentY + y][currentX + x]
            if isinstance(current_board, Piece):
                if current_board.pieceColor != self.pieceColor:
                    moves.append(((currentY + y, currentX + x), current_board, self, (self.yCoord, self.xCoord)))
                break
            else:
                moves.append(((currentY + y, currentX + x), None, self, (self.yCoord, self.xCoord)))
            currentX += x
            currentY += y
        return moves

    # 17 - 24
    def knight_step_any_direction_move(self, board, rows, cols, x, y):
        if 0 <= self.xCoord + x < cols and 0 <= self.yCoord + y < rows:
            current_board = board[self.yCoord + y][self.xCoord + x]
            if isinstance(current_board, Piece):
                if current_board.pieceColor != self.pieceColor:
                    return [((self.yCoord + y, self.xCoord + x), current_board, self, (self.yCoord, self.xCoord))]
                else:
                    return []
            return [((self.yCoord + y, self.xCoord + x), None, self, (self.yCoord, self.xCoord))]
        return []

    # 25
    def white_pawn_move(self, board, rows, cols):
        moves = []
        if 0 <= self.yCoord + 1 < rows and board[self.yCoord + 1][self.xCoord] == 0:
            moves.append(((self.yCoord + 1, self.xCoord), None, self, (self.yCoord, self.xCoord)))
        if 0 <= self.yCoord + 1 < cols and 0 <= self.xCoord + 1 < rows:
            current_board = board[self.yCoord + 1][self.xCoord + 1]
            if isinstance(current_board, Piece) and current_board.pieceColor != self.pieceColor:
                moves.append(((self.yCoord + 1, self.xCoord + 1), current_board, self, (self.yCoord, self.xCoord)))
        if 0 <= self.yCoord + 1 < cols and 0 <= self.xCoord - 1 < rows:
            current_board = board[self.yCoord + 1][self.xCoord - 1]
            if isinstance(current_board, Piece) and current_board.pieceColor != self.pieceColor:
                moves.append(((self.yCoord + 1, self.xCoord - 1), current_board, self, (self.yCoord, self.xCoord)))

        return moves

    # 26
    def black_pawn_move(self, board, rows, cols):
        moves = []
        if 0 <= self.yCoord - 1 < rows and board[self.yCoord - 1][self.xCoord] == 0:
            moves.append(((self.yCoord - 1, self.xCoord), None, self, (self.yCoord, self.xCoord)))
        if 0 <= self.yCoord - 1 < cols and 0 <= self.xCoord + 1 < rows:
            current_board = board[self.yCoord - 1][self.xCoord + 1]
            if isinstance(current_board, Piece) and current_board.pieceColor != self.pieceColor:
                moves.append(((self.yCoord - 1, self.xCoord + 1), current_board, self, (self.yCoord, self.xCoord)))
        if 0 <= self.yCoord - 1 < cols and 0 <= self.xCoord - 1 < rows:
            current_board = board[self.yCoord - 1][self.xCoord - 1]
            if isinstance(current_board, Piece) and current_board.pieceColor != self.pieceColor:
                moves.append(((self.yCoord - 1, self.xCoord - 1), current_board, self, (self.yCoord, self.xCoord)))

        return moves


    def list_valid_moves_all(self, board, rows, cols, moveset):
        moves = []
        for i in moveset:
            if i == 1:
                moves += self.one_step_any_direction_move(board, rows, cols, -1, 0)
            if i == 2:
                moves += self.one_step_any_direction_move(board, rows, cols, 0, -1)
            if i == 3:
                moves += self.one_step_any_direction_move(board, rows, cols, 1, 0)
            if i == 4:
                moves += self.one_step_any_direction_move(board, rows, cols, 0, 1)
            if i == 5:
                moves += self.one_step_any_direction_move(board, rows, cols, -1, -1)
            if i == 6:
                moves += self.one_step_any_direction_move(board, rows, cols, 1, -1)
            if i == 7:
                moves += self.one_step_any_direction_move(board, rows, cols, 1, 1)
            if i == 8:
                moves += self.one_step_any_direction_move(board, rows, cols, -1, 1)
            if i == 9:
                moves += self.many_steps_any_direction_move(board, rows, cols, -1, 0)
            if i == 10:
                moves += self.many_steps_any_direction_move(board, rows, cols, 0, -1)
            if i == 11:
                moves += self.many_steps_any_direction_move(board, rows, cols, 1, 0)
            if i == 12:
                moves += self.many_steps_any_direction_move(board, rows, cols, 0, 1)
            if i == 13:
                moves += self.many_steps_any_direction_move(board, rows, cols, -1, -1)
            if i == 14:
                moves += self.many_steps_any_direction_move(board, rows, cols, 1, -1)
            if i == 15:
                moves += self.many_steps_any_direction_move(board, rows, cols, 1, 1)
            if i == 16:
                moves += self.many_steps_any_direction_move(board, rows, cols, -1, 1)
            if i == 17:
                moves += self.knight_step_any_direction_move(board, rows, cols, -2, -1)
            if i == 18:
                moves += self.knight_step_any_direction_move(board, rows, cols, -1, -2)
            if i == 19:
                moves += self.knight_step_any_direction_move(board, rows, cols, 1, -2)
            if i == 20:
                moves += self.knight_step_any_direction_move(board, rows, cols, 2, -1)
            if i == 21:
                moves += self.knight_step_any_direction_move(board, rows, cols, 2, 1)
            if i == 22:
                moves += self.knight_step_any_direction_move(board, rows, cols, 1, 2)
            if i == 23:
                moves += self.knight_step_any_direction_move(board, rows, cols, -1, 2)
            if i == 24:
                moves += self.knight_step_any_direction_move(board, rows, cols, -2, 1)
            if i == 25:
                moves += self.white_pawn_move(board, rows, cols)
            if i == 26:
                moves += self.black_pawn_move(board, rows, cols)
        return moves


def instantiate_piece(piece):
    piece_name = piece[1][0]
    if piece_name == 'King':
        return King(piece)
    elif piece_name == 'Rook':
        return Rook(piece)
    elif piece_name == 'Bishop':
        return Bishop(piece)
    elif piece_name == 'Queen':
        return Queen(piece)
    elif piece_name == 'Knight':
        return Knight(piece)
    elif piece_name == 'Ferz':
        return Ferz(piece)
    elif piece_name == 'Princess':
        return Princess(piece)
    elif piece_name == 'Empress':
        return Empress(piece)
    elif piece_name == 'Pawn':
        return Pawn(piece)
    else:
        return Piece(piece)


class King(Piece):
    moveset = [1, 2, 3, 4, 5, 6, 7, 8]
    value = 900

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, King.moveset)


class Rook(Piece):
    moveset = [9, 10, 11, 12]
    value = 50

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Rook.moveset)


class Bishop(Piece):
    moveset = [13, 14, 15, 16]
    value = 30

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Bishop.moveset)


class Queen(Piece):
    moveset = [9, 10, 11, 12, 13, 14, 15, 16]
    value = 90

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Queen.moveset)


class Knight(Piece):
    moveset = [17, 18, 19, 20, 21, 22, 23, 24]
    value = 30

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Knight.moveset)


class Ferz(Piece):
    moveset = [5, 6, 7, 8]
    value = 20

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Ferz.moveset)


class Princess(Piece):
    moveset = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    value = 60

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Princess.moveset)


class Empress(Piece):
    moveset = [9, 10, 11, 12, 17, 18, 19, 20, 21, 22, 23, 24]
    value = 80

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        return super().list_valid_moves_all(board, rows, cols, Empress.moveset)


class Pawn(Piece):
    whitemoveset = [25]
    blackmoveset = [26]
    value = 10

    def __init__(self, piece):
        super().__init__(piece)

    def list_valid_moves(self, board, rows, cols):
        if self.pieceColor == 'White':
            return super().list_valid_moves_all(board, rows, cols, Pawn.whitemoveset)
        return super().list_valid_moves_all(board, rows, cols, Pawn.blackmoveset)


#############################################################################
######## Board
#############################################################################
class Board:
    def __init__(self, rows, cols, gameboard):
        self.rows = rows
        self.cols = cols
        # Generate empty board
        empty_board = [[0 for i in range(cols)] for j in range(rows)]
        convert_to_list = list(gameboard.items())
        for piece in convert_to_list:
            instantiated_piece = instantiate_piece(piece)
            xCoord = instantiated_piece.xCoord
            yCoord = instantiated_piece.yCoord
            empty_board[yCoord][xCoord] = instantiated_piece
        self.gameboard = gameboard
        self.board = empty_board
        self.turn = "White"
        self.moves = []

    def gameover(self):
        # 1. check if any king got eaten
        count_king = 0
        for row in range(rows):
            for col in range(cols):
                if isinstance(self.board[row][col], King):
                    count_king += 1

        if count_king != 2:
            return True
        return False

    def white_score(self):
        sum = 0
        for row in range(rows):
            for col in range(cols):
                if isinstance(self.board[row][col], Piece):
                    if self.board[row][col].pieceColor == "White":
                        sum += self.board[row][col].value
        return sum

    def black_score(self):
        sum = 0
        for row in range(rows):
            for col in range(cols):
                if isinstance(self.board[row][col], Piece):
                    if self.board[row][col].pieceColor == "Black":
                        sum += self.board[row][col].value
        return sum

    # check if color is under check
    def is_checked(self, color):
        for row in range(rows):
            for col in range(cols):
                if isinstance(self.board[row][col], Piece):
                    if self.board[row][col].pieceColor != color:
                        piece_moves = self.board[row][col].list_valid_moves(self.board, self.rows, self.cols)
                        for move in piece_moves:
                            if isinstance(move[1], King):
                                return True
        return False

    # get moves for color
    def get_moves(self, color):
        moves = []  # (next coords, capture, piece thats moving, previous coords)
        for row in range(rows):
            for col in range(cols):
                if isinstance(self.board[row][col], Piece):
                    if self.board[row][col].pieceColor == color:
                        piece_moves = self.board[row][col].list_valid_moves(self.board, self.rows, self.cols)
                        if len(piece_moves) > 0:
                            moves += self.board[row][col].list_valid_moves(self.board, self.rows, self.cols)
        return moves

    def make_move(self, move):
        next_coords = move[0]
        capture = move[1]
        piece = move[2]
        current_cords = move[3]
        piece_xCoord = piece.xCoord
        piece_yCoord = piece.yCoord
        self.board[piece_yCoord][piece_xCoord] = 0
        self.board[next_coords[0]][next_coords[1]] = piece
        piece.yCoord = next_coords[0]
        piece.xCoord = next_coords[1]
        self.moves.append(move)

        return

    def unmake_move(self):
        latest_move = self.moves.pop()
        next_coords = latest_move[0]
        capture = latest_move[1]
        piece = latest_move[2]
        previous_coords = latest_move[3]
        if capture != None:
            self.board[next_coords[0]][next_coords[1]] = capture
        else:
            self.board[next_coords[0]][next_coords[1]] = 0
        self.board[previous_coords[0]][previous_coords[1]] = piece
        piece.yCoord = previous_coords[0]
        piece.xCoord = previous_coords[1]

        return



def evaluate(board, maximizing_color):
    if maximizing_color == 'White':
        return board.white_score() - board.black_score()
    else:
        return board.black_score() - board.white_score()
#############################################################################
######## State
#############################################################################
class State:
    def __init__(self, board, parent):
        self.board = board
        self.parent = parent

def convert_result(result):
    next_coords = result[0][0]
    prev_coords = result[0][3]
    convert_next_coords_alphabet = (chr(next_coords[1] + 97), next_coords[0])
    convert_prev_coords_alphabet = (chr(prev_coords[1] + 97), prev_coords[0])

    return convert_prev_coords_alphabet, convert_next_coords_alphabet



# Implement your minimax with alpha-beta pruning algorithm here.
def ab(gameboard):
    initial_board = Board(7, 7, gameboard)
    result = minimax(initial_board, 4, -1 * sys.maxsize, sys.maxsize, True, "White", "White")
    next_move = convert_result(result)
    return next_move


def minimax(board, depth, alpha, beta, maximizing_player, maximizing_colour, current_colour):
    if depth == 0 or board.gameover():
        return None, evaluate(board, maximizing_colour)
    moves = board.get_moves(current_colour)
    best_move = random.choice(moves)

    if maximizing_player:
        max_eval = -1 * sys.maxsize
        for move in moves:
            board.make_move(move)
            current_eval = minimax(board, depth - 1, alpha, beta, False, maximizing_colour, "Black")[1]
            board.unmake_move()
            if current_eval > max_eval:
                max_eval = current_eval
                best_move = move
            alpha = max(alpha, current_eval)
            if beta <= alpha:
                break
        return best_move, max_eval
    else:
        min_eval = sys.maxsize
        for move in moves:
            board.make_move(move)
            current_eval = minimax(board, depth - 1, alpha, beta, True, maximizing_colour, "White")[1]
            board.unmake_move()
            if current_eval < min_eval:
                min_eval = current_eval
                best_move = move
            beta = max(beta, current_eval)
            if beta <= alpha:
                break
        return best_move, min_eval




#############################################################################
######## Parser function and helper functions
#############################################################################
### DO NOT EDIT/REMOVE THE FUNCTION BELOW###
# Return number of rows, cols, grid containing obstacles and step costs of coordinates, enemy pieces, own piece, and goal positions
def parse(testcase):
    handle = open(testcase, "r")

    get_par = lambda x: x.split(":")[1]
    rows = int(get_par(handle.readline()))  # Integer
    cols = int(get_par(handle.readline()))  # Integer
    gameboard = {}

    enemy_piece_nums = get_par(handle.readline()).split()
    num_enemy_pieces = 0  # Read Enemy Pieces Positions
    for num in enemy_piece_nums:
        num_enemy_pieces += int(num)

    handle.readline()  # Ignore header
    for i in range(num_enemy_pieces):
        line = handle.readline()[1:-2]
        coords, piece = add_piece(line)
        gameboard[coords] = (piece, "Black")

    own_piece_nums = get_par(handle.readline()).split()
    num_own_pieces = 0  # Read Own Pieces Positions
    for num in own_piece_nums:
        num_own_pieces += int(num)

    handle.readline()  # Ignore header
    for i in range(num_own_pieces):
        line = handle.readline()[1:-2]
        coords, piece = add_piece(line)
        gameboard[coords] = (piece, "White")

    return rows, cols, gameboard


def add_piece(comma_seperated) -> Piece:
    piece, ch_coord = comma_seperated.split(",")
    r, c = from_chess_coord(ch_coord)
    return [(r, c), piece]


def from_chess_coord(ch_coord):
    return (int(ch_coord[1:]), ord(ch_coord[0]) - 97)


# You may call this function if you need to set up the board
def setUpBoard():
    config = sys.argv[1]
    rows, cols, gameboard = parse(config)
    return rows, cols, gameboard


### DO NOT EDIT/REMOVE THE FUNCTION HEADER BELOW###
# Chess Pieces: King, Queen, Knight, Bishop, Rook, Princess, Empress, Ferz, Pawn (First letter capitalized)
# Colours: White, Black (First Letter capitalized)
# Positions: Tuple. (column (String format), row (Int)). Example: ('a', 0)

# Parameters:
# gameboard: Dictionary of positions (Key) to the tuple of piece type and its colour (Value). This represents the current pieces left on the board.
# Key: position is a tuple with the x-axis in String format and the y-axis in integer format.
# Value: tuple of piece type and piece colour with both values being in String format. Note that the first letter for both type and colour are capitalized as well.
# gameboard example: {('a', 0) : ('Queen', 'White'), ('d', 10) : ('Knight', 'Black'), ('g', 25) : ('Rook', 'White')}
#
# Return value:
# move: A tuple containing the starting position of the piece being moved to the new ending position for the piece. x-axis in String format and y-axis in integer format.
# move example: (('a', 0), ('b', 3))

def studentAgent(gameboard):
    # You can code in here but you cannot remove this function, change its parameter or change the return type
    st = time.time()
    move = ab(gameboard)
    print(move)
    et = time.time()
    print(et - st)
    return move  # Format to be returned (('a', 0), ('b', 3))


if __name__ == '__main__':
    rows, cols, gameboard = setUpBoard()
    studentAgent(gameboard)
