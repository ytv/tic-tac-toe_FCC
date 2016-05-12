App.controller('App.Ctrl', function($scope, serviceNextMove) {
    const PLAYER_X = {name: 'playerX', letter: 'X'};//, player: 'user1'
    const PLAYER_O = {name: 'playerO', letter: 'O'};//, player: $scope.opponent.player
    const GAME_OVER_MSG = {tie: 'It\'s a tie!',
                           X: 'X wins!',
                           O: 'O wins!'};
    var gameOver = false;
    $scope.board = [{index: 0, mark: ''},
                    {index: 1, mark: ''},
                    {index: 2, mark: ''},
                    {index: 3, mark: ''},
                    {index: 4, mark: ''},
                    {index: 5, mark: ''},
                    {index: 6, mark: ''},
                    {index: 7, mark: ''},
                    {index: 8, mark: ''}];

    // Default settings for user selections.
    // Will be modified based on user's selections in modal.
    var opponent = {name: 'playerO', player: 'computer'};
    var user1 =  {name: 'playerX', player: 'user1'};
    var first = 'yes';
    var whoseTurn = PLAYER_X;

    // Functions called with ng-click to modify user selections
    $scope.selectOpponent = function(selection) {
       opponent.player = (selection === 'computer') ? 'computer' : 'user2';
    };
    $scope.selectXorO = function(selection) {
       user1.name = (selection === 'X') ? 'playerX' : 'playerO';
    };
    $scope.selectOrder = function(selection) {
       first = selection;
    };

    // Function to run after user makes selections and clicks "Let's Play" button
    $scope.playerSetup = function() {
        // Initializes the rest of the settings based on user selections
        opponent.name = (user1.name === PLAYER_X.name) ? PLAYER_O.name : PLAYER_X.name;
        if (first === 'yes')
            whoseTurn = (user1.name === PLAYER_X.name) ? PLAYER_X : PLAYER_O;
        else
            whoseTurn = (opponent.name === PLAYER_X.name) ? PLAYER_X : PLAYER_O;
        $scope.modal = {
            "display": "none"
        }

        // Will only execute if computer is going first
        if(first !== 'yes' && opponent.player === 'computer') {
            // Will pass null parameter for move because no move is initially made by user
            var result = serviceNextMove.mainHandler(getOtherPlayer(whoseTurn.letter), null, opponent.player);
            updateMove(result.computerMove, result);
        }
    };

    // Function to run whenever the user clicks to make a move
    $scope.updateUserMove = function(n) {
        if(!gameOver) {
            $scope.msg = '';
            (opponent.player === 'computer') ? playAgainstComputer(n) : playAgainstUser2(n);
        }
    };

    // result returns error status, game status, and computer move if playing against
    // a computer
    playAgainstComputer = function(n) {
        var result = serviceNextMove.mainHandler(whoseTurn.letter, n, opponent.player);
        // handler for user's move
        updateMove(n, result);
        // handler for computer's move
        updateMove(result.computerMove, result);
    };

    playAgainstUser2 = function(n) {
        var result = serviceNextMove.mainHandler(whoseTurn.letter, n, opponent.player);
        updateMove(n, result);
    };

    // Main controller function that coordinates error checking, marking,
    // and status checking all moves made
    updateMove = function(n, result) {
        // Check for error
        if(result.errorCheck.error) {
            outputErrorMsg(result);
        }
        else {
            if(!isNaN(n)) {
                markBoard(n);
                switchTurns();
            }
            checkIfGameOver(result);
        }
    };

    outputErrorMsg = function(result) {
        console.log('Error ' + result.errorCheck.number + ': ' + result.errorCheck.message);
        $scope.msg = result.errorCheck.message;
    };

    checkIfGameOver = function(result) {
        if(result.status !== 'continue') {
            gameOver = true;
            $scope.msg = GAME_OVER_MSG[result.status];
        }
    };

    getOtherPlayer = function(playerLetter) {
        return serviceNextMove.otherPlayer(playerLetter);
    };

    markBoard = function(n) {
        $scope.board[n].mark = (whoseTurn.name === PLAYER_X.name) ? PLAYER_X.letter : PLAYER_O.letter;
    };

    switchTurns = function() {
        whoseTurn = (whoseTurn.name === PLAYER_X.name)? PLAYER_O : PLAYER_X;
    };

    $scope.reset = function() {
        //reset values
        serviceNextMove.reset();
        gameOver = false;
        $scope.msg = '';
        $scope.modal = { 'display': 'block'};
        // reset squares
        for(var i = 0; i < $scope.board.length; i++)
            $scope.board[i].mark = '';
    };

    // Swaps the colors of modal icons
    $scope.colorIcon = function(n) {
        var color1 = {'color': 'blue'};
        var color2 = {'color': '#999'};
        switch (n) {
            case 1:
                $scope.colorBtn1 = color1;
                $scope.colorBtn2 = color2;
                break;
            case 2:
                $scope.colorBtn1 = color2;
                $scope.colorBtn2 = color1;
                break;
            case 3:
                $scope.colorBtn3 = color1;
                $scope.colorBtn4 = color2;
                break;
            case 4:
                $scope.colorBtn3 = color2;
                $scope.colorBtn4 = color1;
                break;
            case 5:
                $scope.colorBtn5 = color1;
                $scope.colorBtn6 = color2;
                break;
            case 6:
                $scope.colorBtn5 = color2;
                $scope.colorBtn6 = color1;
                break;
        };
    };
});
