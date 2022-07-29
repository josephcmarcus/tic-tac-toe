(() => {
    const container = document.getElementById('main-container');
    container.addEventListener('click', (event) => {
        if (event.target.className != 'box' || gameState.activeGameCheck() === false || 
        document.getElementById(event.target.id).innerText != '') {
            return;
        } else {
            gameBoard.addMarker(event.target.id);
        }
    });
})();

const gameBoard = (() => {
    const _boxes = document.getElementsByClassName('box');
    const _markers = {
        playerOneMarker: 'X',
        playerTwoMarker: 'O',
        playerOneValue: 1,
        playerTwoValue: -1,
        current: '',
        currentValue: ''
    };

    let _layout = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];

    // object serves as key for placing marker on square and calls score check on intersecting patterns
    // tl is top left, tc is top center, etc...
    const _markerLocations = {
        tl: (value) => {
            _layout[0][0] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.topRow, 
                gameState.calcPatterns.leftCol, 
                gameState.calcPatterns.ltrDiag
            ]);
        },
        tc: (value) => {
            _layout[0][1] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.topRow,
                gameState.calcPatterns.middleCol
            ]);
        },
        tr: (value) => {
            _layout[0][2] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.topRow,
                gameState.calcPatterns.rightCol,
                gameState.calcPatterns.rtlDiag
            ]);
        },
        ml: (value) => {
            _layout[1][0] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.middleRow,
                gameState.calcPatterns.leftCol,
                gameState.calcPatterns.middleCol
            ]);
        },
        mc: (value) => {
            _layout[1][1] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.middleRow,
                gameState.calcPatterns.middleCol,
                gameState.calcPatterns.rtlDiag,
                gameState.calcPatterns.ltrDiag
            ]);
        },
        mr: (value) => {
            _layout[1][2] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.middleRow,
                gameState.calcPatterns.rightCol
            ]);
        },
        bl: (value) => {
            _layout[2][0] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.bottomRow, 
                gameState.calcPatterns.leftCol, 
                gameState.calcPatterns.rtlDiag
            ]);
        },
        bc: (value) => {
            _layout[2][1] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.bottomRow,
                gameState.calcPatterns.middleCol
            ]);
        },
        br: (value) => {
            _layout[2][2] = value;
            gameState.scoreCheck([
                gameState.calcPatterns.bottomRow,
                gameState.calcPatterns.rightCol,
                gameState.calcPatterns.ltrDiag
            ]);
        }   
    };

    const addMarker = (location) => {
        if (gameState.playerTurnCheck() === 'playerOne') { // checks current player to assign correct mark
            _markers.current = _markers.playerOneMarker;
            _markers.currentValue = _markers.playerOneValue;
        } else {
            _markers.current = _markers.playerTwoMarker;
            _markers.currentValue = _markers.playerTwoValue;
        }
        _markerLocations[location](_markers.currentValue); // updates value of board location
        document.getElementById(location).innerText = _markers.current; // adds current marker to board location
        gameState.playerSwitch(gameState.playerTurnCheck()); // switches to opposite player
    };

    const resetBoard = () => {
        _layout = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ];
        for (box of _boxes) {
            box.innerText = '';
        };
    }
 
    const layoutCheck = () => _layout;

    return {
        addMarker,
        layoutCheck,
        resetBoard
    };
})();

const gameState = (() => {
    const _currentTurnDiv = document.getElementById('current-turn');
    const _winnerDiv = document.getElementById('winner');

    document.getElementById('reset-game').addEventListener('click', function() {
        resetGame();
    });

    let _activeGame = true;
    let _currentTurn = 1;
    let _playerTurn = 'playerOne';

    const _gameOver = (player) => {
        if (player != 'tie') {
            player === 'playerOne' ? _winnerDiv.innerText = 'X Wins!' : _winnerDiv.innerText = 'O Wins!';
        } else {
            _winnerDiv.innerText = 'Tie Game'
        };
        _currentTurnDiv.classList.add('hide');
        _winnerDiv.classList.remove('hide');
        _activeGame = false;
    };

    const activeGameCheck = () => _activeGame;
    const playerTurnCheck = () => _playerTurn;

    const playerSwitch = (player) => {
        if (player === 'playerOne') {
            _playerTurn = 'playerTwo';
            _currentTurnDiv.innerText = `O's Turn`;
        } else {
            _playerTurn = 'playerOne';
            _currentTurnDiv.innerText = `X's Turn`;
        }
        _currentTurn += 1;
    };

    // calculates patterns on board for scoreCheck function
    const calcPatterns = {
        topRow: () => gameBoard.layoutCheck()[0].reduce((pre, curr) => pre + curr, 0), 
        middleRow: () => gameBoard.layoutCheck()[1].reduce((pre, curr) => pre + curr, 0),
        bottomRow: () => gameBoard.layoutCheck()[2].reduce((pre, curr) => pre + curr, 0),
        leftCol: () => gameBoard.layoutCheck()[0][0] + gameBoard.layoutCheck()[1][0] + gameBoard.layoutCheck()[2][0],
        middleCol: () => gameBoard.layoutCheck()[0][1] + gameBoard.layoutCheck()[1][1] + gameBoard.layoutCheck()[2][1],
        rightCol: () => gameBoard.layoutCheck()[0][2] + gameBoard.layoutCheck()[1][2] + gameBoard.layoutCheck()[2][2],
        ltrDiag: () => gameBoard.layoutCheck()[0][0] + gameBoard.layoutCheck()[1][1] + gameBoard.layoutCheck()[2][2],
        rtlDiag: () => gameBoard.layoutCheck()[0][2] + gameBoard.layoutCheck()[1][1] + gameBoard.layoutCheck()[2][0]
    };

    const scoreCheck = (patterns) => {
        patterns.map(function(pattern) {
            if (_currentTurn === 9) {
                pattern() === 3 || pattern() === -3 ? _gameOver(_playerTurn) : _gameOver('tie');
                return;
            };
            if (pattern() === 3 || pattern() === -3) {
                _gameOver(_playerTurn)
                return;
            };
        });
}; 

    const resetGame = () => {
        _playerTurn = 'playerOne';
        _winnerDiv.classList.add('hide');
        _currentTurnDiv.classList.remove('hide');
        _currentTurnDiv.innerText = `X's Turn`;
        _currentTurn = 1;
        gameBoard.resetBoard();
        _activeGame = true;
    }

    return {
        activeGameCheck,
        calcPatterns,
        playerSwitch,
        playerTurnCheck,
        resetGame,
        scoreCheck,
    }
})();