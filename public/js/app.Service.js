App.service('serviceNextMove', function() {
    const _PLAYER_X = 'X';
    const _PLAYER_O = 'O';
    const _WINNING_COMBOS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
                         [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    var _board = [];
    var _xMoves = [];
    var _oMoves = [];

    var result = {
        status: 'continue',
        computerMove: '',
        errorCheck: {
            error: false,
            // error number 1: Position already filled --> user error
            // error number 2: Position already filled --> computer error
            number: '',
            message: '',
        },
    };

    this.mainHandler = function(playerLetter, n, opponent) {
        this._resetErrorCheck();
        this._checkForError(n, 1);
        if(result.errorCheck.error)
            return result;
        else {
            if(n !== null)
                this._updateBoard(playerLetter, n);
            if(opponent === 'computer')
                this.getComputerMove(this.otherPlayer(playerLetter));
            result.status = this._getBoardStatus();
            return result;
        }
    };

    // Initializes result.computerMove if playing against the computer
    this.getComputerMove = function(playerLetter) {
        var computerMove = this._findBestMove(playerLetter)[0];
        if(!isNaN(computerMove)) {
            this._checkForError(computerMove, 2);
            if(result.errorCheck.error)
                return result;
            this._updateBoard(playerLetter, computerMove);
        }
        result.computerMove = computerMove;
    }

    this.reset = function() {
        _board = [];
        _xMoves = [];
        _oMoves = [];
        result.status = 'continue';
        result.computerMove = '';
        this._resetErrorCheck();
    };

    this.otherPlayer = function (playerLetter) {
        return (playerLetter === _PLAYER_X) ? _PLAYER_O : _PLAYER_X;
    };

    this._updateBoard = function(playerLetter, n) {
        _board.push(n);
        (playerLetter === _PLAYER_X) ? _xMoves.push(n) : _oMoves.push(n);
    };

    this._undoBoard = function(player) {
        _board.pop();
        (player === _PLAYER_X)? _xMoves.pop() : _oMoves.pop();
    };

    // Checks if winningCombo is a subarray of playerMoves
    this._isSubArray = function(winningCombo, playerMoves) {
        for(var i = 0; i < winningCombo.length; i++) {
            if (playerMoves.indexOf(winningCombo[i]) === -1)
                return false;
        }
        return true;
    };

    // Returns 'tie', 'continue', 'X' if _PLAYER_X won, and 'O' if _PLAYER_O won
    this._getBoardStatus = function() {
        for(var i = 0; i < _WINNING_COMBOS.length; i++) {
            if (this._isSubArray(_WINNING_COMBOS[i], _xMoves))
                return _PLAYER_X;
            else if (this._isSubArray(_WINNING_COMBOS[i], _oMoves))
                return _PLAYER_O;
        }
        return (_board.length === 9) ? 'tie' : 'continue';
    };

    // finds available moves
    this._getAvailableMoves = function() {
        return [0,1,2,3,4,5,6,7,8].filter(function(element) {
            return _board.indexOf(element) === -1;
        });
    },

    // Utilizes the minimax algorithm
    // Returns 'tie', 'X' if _PLAYER_X won, and 'O' if _PLAYER_O won
    // or a number for the player's next move;
    this._findBestMove = function(playerLetter) {
        var gameState = this._getBoardStatus();
        if(gameState === _PLAYER_X)
            return [_PLAYER_X, 1];
        else if (gameState === _PLAYER_O)
            return [_PLAYER_O, -1];
        else if (gameState === 'tie')
            return ['tie', 0];
        else {
            var best = null;
            var nextMove = null;
            var availableMoves = this._getAvailableMoves();
            for(var i = 0; i < availableMoves.length; i++) {
                this._updateBoard(playerLetter, availableMoves[i]);
                var temp_result = this._findBestMove(this.otherPlayer(playerLetter));
                this._undoBoard(playerLetter);
                // Best is only changed if it's currently null or if the score of
                // the current move being analyzed beats the best score on record so far.
                // Best possible score of player X is 1.  Best possible  score for player O is -1.
                var score = temp_result[1];
                if(best === null || (playerLetter === _PLAYER_X && score > best) ||
                  (playerLetter === _PLAYER_O && score < best)) {
                    best = score;
                    nextMove = availableMoves[i];
                }
                // Below exits the for loop as soon as a player makes a move that
                // gives it its best possible score
                if((playerLetter === _PLAYER_X && best === 1) ||
                    (playerLetter === _PLAYER_O && best === -1)){
                    break;
                }
            }
            return [nextMove, best];
        }
    };

    this._checkForError = function(n, m) {
        if (_board.indexOf(n) > -1 && n !== null) {
            result.errorCheck = {
                error: true,
                number: m,
                message: 'Position already filled',
            }
        }
        return result;
    };

    this._resetErrorCheck = function() {
        result.errorCheck = {
            error: false,
            number: '',
            message: '',
        };
    };

});
