THEME = {
    DARK: 'dark',
    LIGHT: 'light'
}

if (localStorage.getItem('difficulty') === null) {
    localStorage.setItem('difficulty', DIFFICULTIES.Easy.Name);
};

if (localStorage.getItem('theme') === null) {
    localStorage.setItem('theme', THEME.DARK);
};

document.querySelector('#toggle-theme').addEventListener('click', (e) => {
    
    e.currentTarget.classList.toggle('dark');

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === THEME.DARK) {
        localStorage.setItem('theme', THEME.LIGHT);
    } else {
        localStorage.setItem('theme', THEME.DARK);
    }

    renderPage();

})

document.querySelector('#button-hint').addEventListener('click', (e) => {
    
    gameManagerInstance.useHint()

})

document.querySelector('#button-pause').addEventListener('click', (e) => {
    
    document.getElementById('menu').classList.remove("up")
    document.getElementById('game').classList.add("down")
    gameManagerInstance.pause()
    renderPage()

})

document.querySelector('#button-menu-play').addEventListener('click', (e) => {
    
    document.getElementById('menu').classList.add("up")
    document.getElementById('game').classList.remove("down")

    let difficulty = localStorage.getItem("difficulty")
    gameManagerInstance.newGame(difficulty)
    gameManagerInstance.play()

})

document.querySelector('#button-menu-continue').addEventListener('click', (e) => {
    
    document.getElementById('menu').classList.add("up")
    document.getElementById('game').classList.remove("down")
    gameManagerInstance.play()

    document.querySelectorAll('#button-diff').forEach(button => {
        button.classList.remove("button-active")
        if (button.dataset.difficulty === gameManagerInstance.getDifficulty()) {
            button.classList.add("button-active")
        }
    })

})

document.querySelectorAll('#button-diff').forEach(button => button.addEventListener('click', (e) => {
    // gameManagerInstance.newGame(e.currentTarget.dataset.difficulty)
    document.querySelectorAll('#button-diff').forEach(button => button.classList.remove("button-active"))
    e.currentTarget.classList.add("button-active")
    localStorage.setItem("difficulty", e.currentTarget.dataset.difficulty)
}))

document.querySelector('#button-final').addEventListener('click', (e) => {
    
    gameManagerInstance.setInputModeFinal()

})

document.querySelector('#button-note').addEventListener('click', (e) => {
    
    gameManagerInstance.setInputModeNote()

})

window.onload = () => {
    document.querySelector('body').onkeydown = (e) => {

        const key = parseInt(e.key);
        
        if (e.key === 'Backspace') 
        {
            gameManagerInstance.clearSudokuCellNotes();
            return;
        }
        else if (e.key === 'h') {
            gameManagerInstance.useHint()
        }
        else if (e.key === ' ') {
            if (gameManagerInstance.getInputMode() === INPUT_MODE.Final) {
                gameManagerInstance.setInputModeNote()
            } else {
                gameManagerInstance.setInputModeFinal()
            }
        }
        else
        {
            if (gameManagerInstance.getInputMode() === INPUT_MODE.Final) {
                gameManagerInstance.answerCell(parseInt(e.key))
            } else {
                gameManagerInstance.noteCell(parseInt(e.key))
            }
        }
    }
}

function renderPage() {

    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === THEME.DARK) {
        document.querySelector(':root').style.setProperty('--bg-body',                      'var(--bg-body-dark)');
        document.querySelector(':root').style.setProperty('--bg-sudoku-cell',               'var(--bg-sudoku-cell-dark)');
        document.querySelector(':root').style.setProperty('--sudoku-cell-active-fill',      'var(--sudoku-cell-active-fill-dark)');
        document.querySelector(':root').style.setProperty('--text-sudoku-cell-color',       'var(--text-sudoku-cell-color-dark)');
        document.querySelector(':root').style.setProperty('--text-sudoku-info-color',       'var(--text-sudoku-info-color-dark)');
        document.querySelector(':root').style.setProperty('--sodoku-cell-disabled-fill',    'var(--sodoku-cell-disabled-fill-dark)');
    } else {
        document.querySelector(':root').style.setProperty('--bg-body',                      'var(--bg-body-light)');
        document.querySelector(':root').style.setProperty('--bg-sudoku-cell',               'var(--bg-sudoku-cell-light)');
        document.querySelector(':root').style.setProperty('--sudoku-cell-active-fill',      'var(--sudoku-cell-active-fill-light)');
        document.querySelector(':root').style.setProperty('--text-sudoku-cell-color',       'var(--text-sudoku-cell-color-light)');
        document.querySelector(':root').style.setProperty('--text-sudoku-info-color',       'var(--text-sudoku-info-color-light)');
        document.querySelector(':root').style.setProperty('--sodoku-cell-disabled-fill',    'var(--sodoku-cell-disabled-fill-light)');
    }

    document.querySelectorAll('#button-diff').forEach(button => {
        button.classList.remove("button-active")
        if (button.dataset.difficulty === gameManagerInstance.getDifficulty()) {
            button.classList.add("button-active")
        }
    })

    if (gameManagerInstance.getState() === GAME_STATE.Paused) {
        document.getElementById('button-menu-continue').style.display = 'flex'
        document.getElementById('button-menu-continue').innerHTML = 'Continue'
    } else {
        document.getElementById('button-menu-continue').style.display = 'none'
    }

}
renderPage();
