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


function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");            
    }
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

// show choose_player_modal 
function choosePlayerModal(e){
    // show the modale
    const choosePlayerModal=document.getElementById("choose_player_modal");
    const playersContainer = document.getElementById("players_container");
    choosePlayerModal.classList.remove("hidden");
    players.forEach(player => {
        const positions = player.position.join(' / ');
        playersContainer.innerHTML+=`<div>
                                    <div class="flex items-center p-2 bg-neutral-700 rounded-lg">
                                        <img alt="Image of Messi" class="w-10 h-10 rounded-full" height="40" src="${player.photo}" width="40"/>
                                        <div class="ml-4 flex-1">
                                        <div class="text-white font-semibold">${player.name}</div>
                                        </div>
                                        <div class="text-gray-400 mr-4">${positions}</div>
                                        <div class="flex space-x-2">
                                        <img alt="Flag" class="w-5 h-5" height="20" src="${player.flag}" width="30"/>
                                        <img alt="Club logo" class="w-5 h-5" height="20" src="${player.logo}" width="30"/>
                                        </div>
                                    </div>
                                    </div>`
    });   
}
