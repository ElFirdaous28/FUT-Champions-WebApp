async function loadData() {
    const response = await fetch('../data/players.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.players; // Make sure to return just the players array
}

async function init() {
    try {
        // Fetch the players data and save it in localStorage
        const players = await loadData();
        localStorage.setItem('players', JSON.stringify(players));
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

init();
let players = JSON.parse(localStorage.getItem("players")) || []; // This will now be an array
// Extract and deduplicate countries/flags and clubs/logos
const deduplicate = (arr, key1, key2) =>
    arr.filter((item, index, self) =>
        index === self.findIndex((t) => t[key1] === item[key1] && t[key2] === item[key2])
    );

const countriesAndFlags = deduplicate(players.map(player => ({
    country: player.nationality,
    flag: player.flag
})), 'country', 'flag');

const clubsAndLogos = deduplicate(players.map(player => ({
    club: player.club,
    logo: player.clubLogo
})), 'club', 'logo');

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");            
    }
  }

// show choose_player_modal 
function choosePlayerModal(e){
    // show the modale
    const choosePlayerModal=document.getElementById("choose_player_modal");
    const playersContainer = document.getElementById("players_container");
    choosePlayerModal.classList.remove("hidden");
    const PlayerPosition = e.target.closest("button").parentElement.getAttribute("data-position");
    playersContainer.innerHTML="";

    players.forEach(player => {
        if(player.position.includes(PlayerPosition)){            
            const positions = player.position.join(' / ');
            playersContainer.innerHTML+=`<div>
                                        <div class="flex items-center p-2 bg-neutral-700 rounded-lg">
                                            <img alt="Image of Messi" class="w-16 h-16 rounded-full" height="40" src="${player.photo || 'https://via.placeholder.com/150?text=No+Image'}" width="40"/>
                                            <div class="ml-4 flex-1">
                                            <div class="text-white font-semibold">${player.name}</div>
                                            </div>
                                            <div class="text-gray-400 mr-4">${positions}</div>
                                            <div class="flex space-x-2">
                                            <img alt="Flag" class="w-5 h-5" height="20" src="${player.flag || 'https://via.placeholder.com/150?text=No+Image'}" width="30"/>
                                            <img alt="Club logo" class="w-5 h-5" height="20" src="${player.logo || 'https://via.placeholder.com/150?text=No+Image'}" width="30"/>
                                            </div>
                                        </div>
                                        </div>`
        }
    });   
}
// add event lisner to close the choose_player_modal pop up
document.getElementById("close_choose_player_modal").addEventListener("click",()=>{
    closeModal("choose_player_modal");
});
// Close modal when clicking outside the modal content
document.getElementById("choose_player_modal").addEventListener("click", (e) => {
    const modalContent = document.getElementById("modal_content");
    // If the click target is the modal itself (outside the content), close the modal
    if (!modalContent.contains(e.target)) {
        closeModal("choose_player_modal");
    }
});

// add player functions

function addPlayer(){
    const addPlayerModal=document.getElementById("add_player_modal");
    addPlayerModal.classList.remove("hidden");
    showNtionalitySelect();
}

// add event lisner to close the add_player_modal pop up
document.getElementById("close_add_player_modal").addEventListener("click",()=>{
    closeModal("add_player_modal");
});
// Close modal when clicking outside the modal content
document.getElementById("add_player_modal").addEventListener("click", (e) => {
    const modalContent = document.getElementById("modal_content");
    // If the click target is the modal itself (outside the content), close the modal
    if (!modalContent.contains(e.target)) {
        closeModal("add_player_modal");
    }
});

// show countries in nattionality select
function showNtionalitySelect(){
    const nationalitySelect = document.getElementById("nationality_select")
    countriesAndFlags.forEach((country)=>{
        const option = document.createElement("option");
        option.value = country.country;
        option.textContent = country.country;
        nationalitySelect.appendChild(option);
    })
}
// show countries in clube select
function showNtionalitySelect(){
    const clubSelect = document.getElementById("club_select")
    clubsAndLogos.forEach((club)=>{
        const option = document.createElement("option");
        option.value = club.club;
        option.textContent = club.club;
        clubSelect.appendChild(option);
    })
}