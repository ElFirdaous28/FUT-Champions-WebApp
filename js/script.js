async function loadData() {
    const response = await fetch('../data/players.json');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.players; // Make sure to return just the players array
}

async function addIdsToPlayers(players) {
    return players.map((player, index) => ({
        ...player,
        id: `player-${index + 1}`
    }));
}

async function init() {
    try {
        // Fetch the players data
        const players = await loadData(); 
        // Add unique IDs to each player
        const playersWithIds = await addIdsToPlayers(players);

        // Save the players data with IDs to localStorage
        localStorage.setItem('players', JSON.stringify(playersWithIds));
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

init();
let players = JSON.parse(localStorage.getItem("players")) || [];
 // This will now be an array
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
        const rating = parseInt(document.getElementById("rating").value);
        const newPlayer = {
            name,
            photo,
            position: [position],
            nationality,
            flag,
            club,
            logo,
            rating,
        };

        // in case of goalkeepers
        if (position === "GK") {
            newPlayer.diving = parseInt(document.getElementById("diving").value);
            newPlayer.handling = parseInt(document.getElementById("handling").value);
            newPlayer.kicking = parseInt(document.getElementById("kicking").value);
            newPlayer.reflexes = parseInt(document.getElementById("reflexes").value);
            newPlayer.speed = parseInt(document.getElementById("speed").value);
            newPlayer.positioning = parseInt(document.getElementById("positioning").value);
        } 
        else { // For other positions
            newPlayer.pace = parseInt(document.getElementById("pace").value);
            newPlayer.shooting = parseInt(document.getElementById("shooting").value);
            newPlayer.passing = parseInt(document.getElementById("passing").value);
            newPlayer.dribbling = parseInt(document.getElementById("dribbling").value);
            newPlayer.defending = parseInt(document.getElementById("defending").value);
            newPlayer.physical = parseInt(document.getElementById("physical").value);
        }
        const playerId = document.getElementById("save_player_btn").getAttribute("data-player-id");
        
        // creat a new player if playerId is empty
        if (playerId === "") {
            newPlayer.id = `player-${players.length + 1}`;
            players.push(newPlayer); // Add new player to the array
            alert("Player added successfully!");
        } 
        // modify a new player if playerId is not empty
        else {
            const playerIndex = players.findIndex(player => player.id === playerId);
            if (playerIndex !== -1) {
                newPlayer.id = playerId; // Keep the same ID
                players[playerIndex] = newPlayer;
                document.getElementById("add_player_modal").classList.add("hidden");
                alert("Player updated successfully!");
            }
        }

        localStorage.setItem("players", JSON.stringify(players));

        // Clear the form and reset photo
        document.getElementById("add_player_form").reset();
        document.getElementById("playerPhotoPreview").src = "src/assets/img/user.png";

        // Reset the data-player-id attribute
        document.getElementById("save_player_btn").setAttribute("data-player-id", "");
    }
});



// function to show  modification modal  of player
function modifyPlayer(event) {
    // Show the add_player_modal as modify modal and hide chooseuser modal
    document.getElementById("add_player_modal").classList.remove("hidden");
    document.getElementById("choose_player_modal").classList.add("hidden");

    const playerId = event.target.closest("button").getAttribute("data-player-id");
    
    // find the player in palyers array
    const playerData = players.find(player => player.id === playerId);
    document.getElementById("save_player_btn").setAttribute("data-player-id",playerId);
    showNtionalitySelect();
    showClubSelect();

    document.getElementById("player_name").value = playerData.name;
    document.getElementById("playerPhotoPreview").src = playerData.photo;
    document.getElementById("nationality_select").value = playerData.nationality;
    document.getElementById("club_select").value = playerData.club;
    document.getElementById("player_position").value = playerData.position;
    document.getElementById("rating").value = playerData.rating;
    document.getElementById("pace").value = playerData.pace;
    document.getElementById("shooting").value = playerData.shooting;
    document.getElementById("passing").value = playerData.passing;
    document.getElementById("dribbling").value = playerData.dribbling;
    document.getElementById("defending").value = playerData.defending;
    document.getElementById("physical").value = playerData.physical;

    // If the position is goalkeeper, display the goalkeeper statistics
    if (playerData.position === "GK") {
        document.querySelectorAll(".gk_position").forEach(function(field) {
            field.classList.remove("hidden");
        });
        // Set goalkeeper statistics
        document.getElementById("diving").value = playerData.diving;
        document.getElementById("handling").value = playerData.handling;
        document.getElementById("kicking").value = playerData.kicking;
        document.getElementById("reflexes").value = playerData.reflexes;
        document.getElementById("speed").value = playerData.speed;
        document.getElementById("positioning").value = playerData.positioning;
    } else {
        // If the position is not GK, hide the goalkeeper fields
        document.querySelectorAll(".gk_position").forEach(function(field) {
            field.classList.add("hidden");
        });
    }
}

function removePlayer(event){
    const playerId = event.target.closest("button").getAttribute("data-player-id");
    const playerIndex = players.findIndex(player => player.id === playerId);
    if (confirm("Are you sure you want to remove this player?") == true) {
        players.splice(playerIndex, 1);//remove one element from the index
        localStorage.setItem('players', JSON.stringify(players));
        alert("you removed the player");
    }  
}