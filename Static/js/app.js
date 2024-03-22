THEME = {
    DARK: 'dark',
    LIGHT: 'light'
}

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

document.querySelector('#button-restart').addEventListener('click', (e) => {
    
    gameManagerInstance.newGame()

})

window.onload = () => {
    document.querySelector('body').onkeydown = (e) => {

        const key = parseInt(e.key);

        // console.log(`CURRENT ${gameManagerInstance.newGame()}`);
        
        if (e.key === 'Backspace') 
        {
            gameManagerInstance.clearSudokuCell();
            return;
        }
        else
        {
            gameManagerInstance.answerCell(parseInt(e.key))
        }

        // localStorage.setItem('grid', JSON.stringify(grid));
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

}
renderPage();
