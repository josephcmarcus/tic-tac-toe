(() => {
    const container = document.getElementById('container');

    container.addEventListener('click', (event) => {
        if (event.target.className != 'box') {
            return;
        } else {
            let clickLocation = event.target.id;
            gameBoard.addMarker(clickLocation);
        }
    });
})();

const gameBoard = (() => {
    const _markers = {
        markerX: 'X',
        markerO: 'O',
        markerXValue: 1,
        markerOValue: -1,
        currentMarker: '',
        currentMarkerValue: ''
    }
    const _positions = { tl: 0, tc: 0, tr: 0, ml: 0, mc: 0, mr: 0, bl: 0, bc: 0, br: 0 }
    const { tl, tc, tr, ml, mc, mr, bl, bc, br } = _positions;
    let _boardLayout = [
        [tl, tc, tr],
        [ml, mc, mr],
        [bl, bc, br],
    ];
    const addMarker = function(location) {
        if (gameState.playerTurnCheck() === 'playerOne') {
            _markers.currentMarker = _markers.markerX;
            _markers.currentMarkerValue = _markers.markerXValue;
        } else {
            _markers.currentMarker = _markers.markerO;
            _markers.currentMarkerValue = _markers.markerOValue;
        }
        _positions[location] = _markers.currentMarkerValue;
        switch (location) {
            case 'tl':
                _boardLayout[0][0] = _markers.currentMarkerValue;
                break;
            case 'tc':
                _boardLayout[0][1] = _markers.currentMarkerValue;
                break;
            case 'tr':
                _boardLayout[0][2] = _markers.currentMarkerValue;
                break;
            case 'ml':
                _boardLayout[1][0] = _markers.currentMarkerValue;
                break;
            case 'mc':
                _boardLayout[1][1] = _markers.currentMarkerValue;
                break;
            case 'mr':
                _boardLayout[1][2] = _markers.currentMarkerValue;
                break;
            case 'bl':
                _boardLayout[2][0] = _markers.currentMarkerValue;
                break;
            case 'bc':
                _boardLayout[2][1] = _markers.currentMarkerValue;
                break;
            case 'br':
                _boardLayout[2][2] = _markers.currentMarkerValue;
                break;
        }
        gameState.playerSwitch();
    };
    const logger = function() {
        console.log(_positions.tl);
        console.table(_boardLayout)
    }
    return {
        addMarker,
        logger
    };
})();

const gameState = (() => {
    let _playerTurn = 'playerOne';
    const playerTurnCheck = function() {
        return _playerTurn;
    }
    const playerSwitch = function() {
        return _playerTurn === 'playerOne' ? _playerTurn = 'playerTwo' : _playerTurn = 'playerOne';
    }
    return {
        playerTurnCheck,
        playerSwitch
    }
})();