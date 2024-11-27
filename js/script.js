async function loadData() {
    const response = await fetch('../data/players.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data; 
}

async function init() {
    try {
        players = await loadData();
        localStorage.setItem('players', JSON.stringify(players));
    } catch (error) {
        console.error('Error loading data:', error);
    }
}
init()

let  players = JSON.parse(localStorage.getItem("players"))||[];
console.log(players);
