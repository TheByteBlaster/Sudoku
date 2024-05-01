const EASY = {
    Name: 'Easy',
    RevealedNumbers: 50,
    HealthPoints: 5,
    Hints: 5,
    Icon: 'bx bxs-laugh'
}

const MEDIUM = {
    Name: 'Medium',
    RevealedNumbers: 35,
    HealthPoints: 3,
    Hints: 3,
    Icon: 'bx bxs-confused'
}

const HARD = {
    Name: 'Hard',
    RevealedNumbers: 20,
    HealthPoints: 1,
    Hints: 1,
    Icon: 'bx bxs-sad'
}

const INSANE = {
    Name: 'Insane',
    RevealedNumbers: 16,
    HealthPoints: 1,
    Hints: 0,
    Icon: 'bx bxs-dizzy'
}

const DIFFICULTIES = {
    Easy: EASY,
    Medium: MEDIUM,
    Hard: HARD,
    Insane: INSANE
}

const INPUT_MODE = {
    Note: 'note',
    Final: 'final'
}

const GAME_STATE = {
    Ongoing: 'ongoing',
    Paused: 'paused',
    None: 'none',
    Lost: 'lost'
}