let instance;

class GameManager {

    currentPos = {
        row: null,
        col: null
    }

    gameState = {
        Difficulty: null,
        HealthPoints: null,
        Hints: null,
        Grid: null,
        InputMode: null,
        Time: 0,
        State: GAME_STATE.None
    }

    constructor() {
        if (instance) {
            throw new Error("New instance can't be created!!");
        }

        instance = this;


        if (this.loadState()) {
            this.gameState = this.loadState().gameState
        } else {
            this.newGame(DIFFICULTIES.Easy.Name)
        }
        this.generateSudokuElements();
        this.renderGrid();
        this.renderDifficulty();
        this.setHealthPoints();
        this.setHints();
        this.renderTimer();
        this.setInputModeFinal();

        setInterval(
            this.incrementTimer.bind(this),
            1000
        )

    }

    saveState() {
        window.localStorage.setItem('gameManager', JSON.stringify(this));
    }

    loadState() {
        return JSON.parse(window.localStorage.getItem('gameManager'))
    }

    generateGrid() {
        this.gameState.Grid = Array(9);

        for (let index = 0; index < 9; index++) {
            this.gameState.Grid[index] = new Array(9);        
        };

        for (let index = 0; index < 81; index++) {    
            let col = index % 9;
            let row = Math.floor( index / 9 );
    
            this.gameState.Grid[row][col] = {
                givenValue: null,
                correctValue: null,
                enabled: true,
                notes: []
            }
        }

        this.populateGridData()
        this.disableSudokuCells()
        this.saveState()
    }
    
    uniqueInRow(number, row, col) {
        let grid = this.gameState.Grid;

        for (let x = 0; x < 9; x++) {
            if (grid[row][x].correctValue === number && x !== col) return false;
        }
        return true;
    }

    uniqueInCol(number, row, col) {
        let grid = this.gameState.Grid;

        for (let y = 0; y < 9; y++) {
            if (grid[y][col].correctValue === number && y !== row) return false;
        }
        return true;
    }

    uniqueInBox(number, row, col) {
        let grid = this.gameState.Grid;

        const boxRow = Math.floor(row / 3);
        const boxCol = Math.floor(col / 3);

        const minY = boxRow * 3;
        const maxY = minY + 3;

        const minX = boxCol * 3;
        const maxX = minX + 3;

        for (let indexY = minY; indexY < maxY; indexY++) {
            for (let indexX = minX; indexX < maxX; indexX++) {
                
                if (grid[indexY][indexX].correctValue == number && (indexX !== col && indexY !== row)) return false;

            }
        }
        
        return true;
    }

    unique(number, row, col) {

        return this.uniqueInCol(number, row, col) && this.uniqueInRow(number, row, col) && this.uniqueInBox(number, row, col);

    }

    getNextEmptyPosition(pos) {
        let grid = this.gameState.Grid;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x].correctValue === null) {
                    pos.row = y;
                    pos.col = x;
                    return true;
                }
            }
        }

        return false;
    }

    getRandomEmptyPosition(pos) {
        let grid = this.gameState.Grid;
        let emptyCells = []
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x].givenValue === null) {
                    emptyCells.push([y, x])
                }
            }
        }

        if (emptyCells.length > 0) {
            let emptyCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
            pos.row = emptyCell[0];
            pos.col = emptyCell[1];
            return true;
        }

        return false;
    }

    getRandomPosition(pos) {

        let emptyCells = []
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                emptyCells.push([y, x])
            }
        }
        
        let emptyCell = emptyCells[Math.floor(Math.random()*emptyCells.length)];
        pos.row = emptyCell[0];
        pos.col = emptyCell[1];

        return true;
    }

    shuffleNumbers = (numbers) => {
        let numbersCopy = numbers.slice();
        let currentIndex = numbersCopy.length, randomIndex;
    
        while (currentIndex != 0) {
            
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
    
            [numbersCopy[currentIndex], numbersCopy[randomIndex]] = [
                numbersCopy[randomIndex], numbersCopy[currentIndex]
            ];
    
        }
    
        return numbersCopy;
    }

    gridCompleted() {
        let grid = this.gameState.Grid;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x].correctValue === null) return false;
            }
        }
        return true;
    
    }

    populateGridData() {

        let emptyPos = {
            row: -1,
            col: -1
        };
    
        if (!this.getNextEmptyPosition(emptyPos)) return true;
    
        let numbers = this.shuffleNumbers([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    
        let row = emptyPos.row;
        let col = emptyPos.col;
    
        numbers.forEach((num, i) => {
            if (this.unique(num, row, col)) {
                this.gameState.Grid[row][col].correctValue = num;
    
                if (this.gridCompleted()) {
                    return true;
                } else {
                    if (this.populateGridData()) return true;
                }
    
                this.gameState.Grid[row][col].correctValue = null;
            }
        });
    
        return this.gridCompleted();
    }

    disableSudokuCells() {
        let revealedNumbers = this.gameState.Difficulty.RevealedNumbers;

        for (let i = 0; i < revealedNumbers; i++) {
            this.getRandomEmptyPosition(this.currentPos)
            this.gameState.Grid[this.currentPos.row][this.currentPos.col].enabled = false;
            this.gameState.Grid[this.currentPos.row][this.currentPos.col].givenValue = this.gameState.Grid[this.currentPos.row][this.currentPos.col].correctValue;
        }
        
        this.saveState();
    }

    disableSudokuCell(pos) {

    }

    renderGrid() {
        console.log('RENDER GRID');

        let cells = document.querySelectorAll('.sudoku-cell')
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                let currentCellIndex = y * 9 + x;
                cells[currentCellIndex].querySelector('.sudoku-cell-answer').innerHTML = this.gameState.Grid[y][x].givenValue;
                cells[currentCellIndex].querySelector('.sudoku-cell-note').innerHTML = this.gameState.Grid[y][x].notes.map(note =>
                    `<div>${note}</div>`
                ).join('')
            }
        }

    }

    renderCell() {
        console.log('RENDER CELL');

        let cells = document.querySelectorAll('.sudoku-cell')
        let currentCellIndex = this.currentPos.row * 9 + this.currentPos.col;

        cells[currentCellIndex].querySelector('.sudoku-cell-answer').innerHTML = this.gameState.Grid[this.currentPos.row][this.currentPos.col].givenValue;
        cells[currentCellIndex].querySelector('.sudoku-cell-note').innerHTML = this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.map(note =>
            `<div>${note}</div>`
        ).join('')
    }

    resetDifficulty() {
        this.renderDifficulty();
        this.saveState();
    }

    renderDifficulty() {
        document.getElementById('difficulty').innerHTML = this.gameState.Difficulty.Name
        document.getElementById('icon').className = this.gameState.Difficulty.Icon
    }

    getDifficulty() {
        return this.gameState.Difficulty.Name
    }

    resetHealthPoints() {
        this.gameState.HealthPoints = this.gameState.Difficulty.HealthPoints;
        this.setHealthPoints();
        this.saveState();
    }

    setHealthPoints() {
        document.getElementById('healthpoints').innerHTML = this.gameState.HealthPoints
    }

    resetHints() {
        this.gameState.Hints = this.gameState.Difficulty.Hints;
        this.setHints();
        this.saveState();
    }

    setHints() {
        document.getElementById('hints').innerHTML = this.gameState.Hints
    }

    setInputModeFinal() {
        this.gameState.InputMode = INPUT_MODE.Final;
        document.getElementById('button-final').classList.add("button-active")
        document.getElementById('button-note').classList.remove("button-active")
        this.saveState();
    }

    setInputModeNote() {
        this.gameState.InputMode = INPUT_MODE.Note;
        document.getElementById('button-note').classList.add("button-active")
        document.getElementById('button-final').classList.remove("button-active")
        this.saveState();
    }

    getInputMode() {
        return this.gameState.InputMode;
    }

    resetTime() {
        this.gameState.Time = 0
        this.renderTimer()
        this.saveState();
    }

    incrementTimer() {
        if (this.gameState.State === GAME_STATE.Ongoing) {
            let totalSeconds = this.gameState.Time + 1
            this.gameState.Time = totalSeconds
        }
        this.renderTimer();
        this.saveState();
    }

    getTime() {
        return this.gameState.Time
    }

    renderTimer() {
        let totalSeconds = this.gameState.Time;
        let min = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
        let seconds = String(totalSeconds % 60).padStart(2, '0')
        document.getElementById('time-elapsed').innerHTML = `${min}:${seconds}`
    }

    isAlive() {
        return this.gameState.HealthPoints > 0
    }

    decreaseHealthPoints() {

        if (this.gameState.HealthPoints == 1) {
            document.getElementById("banner").classList = ["banner-lost"]
            document.getElementById("banner").innerHTML = "GAME OVER"
    
            this.gameState.State = GAME_STATE.Lost
            this.saveState()
        }

        if (this.gameState.HealthPoints > 0) {
            this.gameState.HealthPoints--;
            this.saveState();
            document.getElementById('healthpoints').innerHTML = this.gameState.HealthPoints
            return true;
        }

        // Game is lost
        return false;

    }

    // HEJ
    decreaseHints() {

        if (this.gameState.Hints > 0) {
            this.gameState.Hints--;
            this.saveState();
            document.getElementById('hints').innerHTML = this.gameState.Hints
            return true;
        } 

        // No more hints
        return false;
    }

    generateSudokuElements() {

        const sudokuField = document.getElementById("sudoku-field");
        sudokuField.innerHTML = "";

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
            
                let cellElement = document.createElement('div');
                cellElement.className = "sudoku-cell"
    
                let answerElement = document.createElement('div');
                answerElement.className = "sudoku-cell-answer";
                answerElement.innerHTML = this.gameState.Grid[row][col].enabled ? null : this.gameState.Grid[row][col].correctValue;

                let noteElement = document.createElement('div');
                noteElement.className = "sudoku-cell-note";

                if (!this.gameState.Grid[row][col].enabled) {
                    cellElement.classList.add('disabled')
                }
                
                cellElement.appendChild(answerElement);
                cellElement.appendChild(noteElement);
                cellElement.addEventListener('mouseover', (e) => {
                    
                    if (!this.gameState.Grid[row][col].enabled || this.gameState.Grid[row][col].givenValue) return;

                    document.querySelector('.active')?.classList.remove('active');
                    e.currentTarget.classList.add('active');
                    
                    this.currentPos.row = row;
                    this.currentPos.col = col;
                    
                })

                cellElement.addEventListener('mouseleave', (e) => {

                    document.querySelector('.active')?.classList.remove('active');
                    
                    this.currentPos.row = -1;
                    this.currentPos.col = -1;
                    
                })
    
                if (row === 2 || row === 5) cellElement.style.marginBottom = '10px'
                if (col === 2 || col === 5) cellElement.style.marginRight = '10px'
    
                sudokuField.appendChild(cellElement);
    
            }
        }
    }

    clearSudokuCellNotes() {
        if (this.currentPos.col >= 0 && this.currentPos.row >= 0) {
            this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes = []
        }
        this.renderCell()
    }

    answerCell(number) {

        if (this.currentPos.row == -1 | this.currentPos.col == -1) {
            return
        }

        this.clearSudokuCellNotes()

        const answers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8]

        if (this.isAlive() && answers.includes(number) && positions.includes(this.currentPos.col) && positions.includes(this.currentPos.row)) {

            document.querySelectorAll('.sudoku-cell')[this.currentPos.row * 9 + this.currentPos.col].classList.remove('active')
            document.querySelector('.bxs-heart').classList.remove('health-decrease')

            if (this.unique(number, this.currentPos.row, this.currentPos.col)) {
                document.querySelectorAll('.sudoku-cell')[this.currentPos.row * 9 + this.currentPos.col].classList.add('correct')
            }
            else {
                document.querySelectorAll('.sudoku-cell')[this.currentPos.row * 9 + this.currentPos.col].classList.add('incorrect')
                document.querySelector('.bxs-heart').classList.add('health-decrease')
                this.decreaseHealthPoints();
            }
            this.gameState.Grid[this.currentPos.row][this.currentPos.col].givenValue = this.gameState.Grid[this.currentPos.row][this.currentPos.col].correctValue;

            this.isDone()
        }
        else {
            return false
        }

        this.saveState()
        this.renderCell()
    }

    noteCell(number) {

        if (this.currentPos.row == -1 | this.currentPos.col == -1) {
            return
        }

        const answers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

        if (this.isAlive() && answers.includes(number)) {

            if (this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.includes(number)) {
                this.removeNote(number);
            } else if (this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.length < 9) {
                this.addNote(number);
            }
            
            this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.sort()
            
        }

        this.renderCell()
    }

    addNote(number) {
        this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.push(number)
    }

    removeNote(number) {
        let index = this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.indexOf(number)
        this.gameState.Grid[this.currentPos.row][this.currentPos.col].notes.splice(index, 1)
    }

    useHint() {
        let emptyPos = {
            row: -1,
            col: -1
        };

        if (!this.decreaseHints()) return

        if(!this.getRandomEmptyPosition(this.currentPos)) return

        let index = this.currentPos.row * 9 + this.currentPos.col;
        document.querySelectorAll('.sudoku-cell')[index].classList.add('hint')

        this.gameState.Grid[this.currentPos.row][this.currentPos.col].givenValue = this.gameState.Grid[this.currentPos.row][this.currentPos.col].correctValue
        this.isDone()
        this.saveState()
        this.renderCell()
    }

    isDone() {
        let grid = this.gameState.Grid;

        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (grid[y][x].givenValue === null) return false;
            }
        }

        console.log("WINNER");
        document.getElementById("banner").classList = ["banner-won"]
        document.getElementById("banner").innerHTML = "WINNER"

        this.gameState.State = GAME_STATE.None
        this.saveState()
        return true;
    }

    play() {
        if (this.isAlive()) {
            this.gameState.State = GAME_STATE.Ongoing
        } else {
            this.gameState.State = GAME_STATE.Lost
        }
        this.saveState()
    }

    pause() {
        if (!this.isAlive() | this.isDone()) {
            this.gameState.State = GAME_STATE.None
        } else {
            this.gameState.State = GAME_STATE.Paused
        }
        document.getElementById("banner").classList = []
        document.getElementById("banner").innerHTML = ""
        this.saveState()
    }

    getState() {
        return this.gameState.State
    }

    newGame(difficulty) {
        switch (difficulty) {
            case DIFFICULTIES.Easy.Name:
                this.gameState.Difficulty = DIFFICULTIES.Easy;
                break;
            case DIFFICULTIES.Medium.Name:
                this.gameState.Difficulty = DIFFICULTIES.Medium;
                break;
            case DIFFICULTIES.Hard.Name:
                this.gameState.Difficulty = DIFFICULTIES.Hard;
                break;
            case DIFFICULTIES.Insane.Name:
                this.gameState.Difficulty = DIFFICULTIES.Insane;
                break;
            default:
                break;
        }

        this.resetDifficulty();
        this.resetHealthPoints();
        this.resetHints();
        this.generateGrid();
        this.generateSudokuElements();
        this.resetTime();
    }
    
}

let gameManagerInstance;
let storedGameManager = window.localStorage.getItem('gameManager');

if (JSON.parse(storedGameManager)?.length === 0) {
    gameManagerInstance = JSON.parse(storedGameManager);
} else {
    gameManagerInstance = Object.freeze(new GameManager());
    window.localStorage.setItem('gameManager', JSON.stringify(gameManagerInstance));
}