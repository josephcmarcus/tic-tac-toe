(() => {
    const container = document.getElementById('container');
    container.addEventListener('click', (event) => {
        if (event.target.className != 'box') {
            return;
        } else {
            gameBoard.addMarker(event.target.id);
        };
    });
})();

const gameBoard = (() => {
    const _markers = {
        x: 'X',
        o: 'O',
        xValue: 1,
        oValue: -1,
        current: '',
        currentValue: ''
    };
    let _layout = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    const _logger = () => {
        console.table(_layout)
    };

    const addMarker = function(location) {
        if (gameState.playerTurnCheck() === 'playerOne') { 
            _markers.current = _markers.x;
            _markers.currentValue = _markers.xValue;
        } else {
            _markers.current = _markers.o;
            _markers.currentValue = _markers.oValue;
        }
        _markerLocations[location](_markers.currentValue); 
        gameState.playerSwitch(gameState.playerTurnCheck());
        _logger();
    };
    // object serves as key for placing marker on square and calls score check on intersecting patterns
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
                gameState.calcPatterns.ltrDiag
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
            gameState.scoreCheck(
                [gameState.calcPatterns.bottomRow, 
                gameState.calcPatterns.leftCol, 
                gameState.calcPatterns.rtlDiag]
            );
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
                gameState.calcPatterns.rtlDiag
            ]);
        }
    };
    const layoutCheck = () => _layout;

    return {
        addMarker,
        layoutCheck,
    };
})();

const gameState = (() => {
    let _playerTurn = 'playerOne';
    const _gameOver = (player) => player === 'playerOne' ? alert('playerOne Wins!') : alert('playerTwo Wins!')
    const playerTurnCheck = () => _playerTurn
    const playerSwitch = (player) => player === 'playerOne' ? _playerTurn = 'playerTwo' : _playerTurn = 'playerOne';
    
    // object calculates patterns on board for scoreCheck function
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
            console.log(pattern())
            if (pattern() === 3 || pattern() === -3) {
                _gameOver(_playerTurn);
            };
        });
    };
    return {
        calcPatterns,
        playerSwitch,
        playerTurnCheck,
        scoreCheck
    }
})();