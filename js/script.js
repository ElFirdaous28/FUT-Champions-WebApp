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
    logo: player.logo
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
    const modalContent = document.getElementById("choose_modal_content");
    // If the click target is the modal itself (outside the content), close the modal
    if (!modalContent.contains(e.target)) {
        closeModal("choose_player_modal");
    }
});

// add player functions

function showAddPlayerModel(){
    const addPlayerModal=document.getElementById("add_player_modal");
    addPlayerModal.classList.remove("hidden");
    showNtionalitySelect();
    showClubSelect();
}

  

// add event lisner to close the add_player_modal pop up
document.getElementById("close_add_player_modal").addEventListener("click",()=>{
    closeModal("add_player_modal");
});
// Close modal when clicking outside the modal content
document.getElementById("add_player_modal").addEventListener("click", (e) => {
    const modalContent = document.getElementById("add_modal_content");
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
function showClubSelect(){
    const clubSelect = document.getElementById("club_select")
    clubsAndLogos.forEach((club)=>{
        const option = document.createElement("option");
        option.value = club.club;
        option.textContent = club.club;
        clubSelect.appendChild(option);
    })
}


// event lessner to show fileds by position
function statisticsFields(){
    const playerPositionSelect = document.getElementById("player_position");
    if(playerPositionSelect.value === "GK"){
        // hide other fields
        document.querySelectorAll(".other_positions").forEach((field)=>{
            field.classList.add("hidden");
        })
        // show GK fields
        document.querySelectorAll(".gk_position").forEach((field)=>{
            field.classList.remove("hidden");
        })
    }
    else{
        // hide other fields
        document.querySelectorAll(".other_positions").forEach((field)=>{
            field.classList.remove("hidden");
        })
        // show GK fields
        document.querySelectorAll(".gk_position").forEach((field)=>{
            field.classList.add("hidden");
        })
    }
}

// Check if field is empty and show error
function notEmptyField(element) {
    const errorMessage = element.parentElement.querySelector("#errorMessage");
    if (errorMessage) {
        errorMessage.remove();
    }
    if (element.value === "") {
        showError(element, "Please choose an option");
        return false;
    } 
    return true;
}



function showError(element, message) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.id = 'errorMessage';
    errorMessage.classList.add('text-red-500');
    element.parentElement.insertAdjacentElement('beforeend', errorMessage);
}


// Save player
document.getElementById("add_player_form").addEventListener("submit", function (event) {
    event.preventDefault();
    // Get selected values
    const club = document.getElementById("club_select").value;
    const position = document.getElementById("player_position").value;
    const nationality = document.getElementById("nationality_select").value;
    const flag = countriesAndFlags.find(item => item.country === nationality)?.flag;
    const logo = clubsAndLogos.find(item => item.club === club)?.logo;

    // Ensure all fields are filled
    if (notEmptyField(document.getElementById("club_select")) &&
        notEmptyField(document.getElementById("player_position")) &&
        notEmptyField(document.getElementById("nationality_select"))) {

        // Extract form values
        const name = document.getElementById("player_name").value;
        const photo = document.getElementById("playerPhotoPreview").src;
        const rating = parseInt(document.getElementById("rating").value, 10);

        // Create new player object
        const newPlayer = {
            name,
            photo,
            position: [position],
            nationality,
            flag,
            club,
            logo, // Example club logo URL
            rating,
        };

        // Add specific stats for goalkeepers
        if (position === "GK") {
            newPlayer.diving = parseInt(document.getElementById("diving").value, 10);
            newPlayer.handling = parseInt(document.getElementById("handling").value, 10);
            newPlayer.kicking = parseInt(document.getElementById("kicking").value, 10);
            newPlayer.reflexes = parseInt(document.getElementById("reflexes").value, 10);
            newPlayer.speed = parseInt(document.getElementById("speed").value, 10);
            newPlayer.positioning = parseInt(document.getElementById("positioning").value, 10);
        } else { // For other positions
            newPlayer.pace = parseInt(document.getElementById("pace").value, 10);
            newPlayer.shooting = parseInt(document.getElementById("shooting").value, 10);
            newPlayer.passing = parseInt(document.getElementById("passing").value, 10);
            newPlayer.dribbling = parseInt(document.getElementById("dribbling").value, 10);
            newPlayer.defending = parseInt(document.getElementById("defending").value, 10);
            newPlayer.physical = parseInt(document.getElementById("physical").value, 10);
        }

        // Add the player to the array
        players.push(newPlayer);

        // Save the updated players array to localStorage
        localStorage.setItem("players", JSON.stringify(players));

        // Clear the form and reset photo
        document.getElementById("add_player_form").reset();
        document.getElementById("playerPhotoPreview").src = "src/assets/img/user.png";

        alert("Player added successfully!");
    }
});

