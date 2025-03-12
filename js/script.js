async function loadData() {
    const response = await fetch('/data/players.json');
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
console.log(players);

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
    // Clear the form and reset photo
    document.getElementById("add_player_form").reset();
    document.getElementById("playerPhotoPreview").src = "src/assets/img/user.png";
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

// Check if select is empty and show error
function notEmptySelect(element) {
    const errorMessage = element.parentElement.querySelector("#errorMessage");
    if (errorMessage) {
        errorMessage.remove();
    }
    if (element.value === "") {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = "Please choose an option";
        errorMessage.id = 'errorMessage';
        errorMessage.classList.add('text-red-500');
        element.parentElement.insertAdjacentElement('beforeend', errorMessage);
        return false;
    } 
    return true;
}
// chek input
function inputNotEmpty(inputElement,message){
    const existingError = document.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }
    if(inputElement.value===""){
        const pError = document.createElement("p");
        pError.textContent = message;
        pError.classList.add("error-message", "text-red-500"); // Add a class for styling
        inputElement.parentElement.appendChild(pError);
        return false;
    }
    else{
        return true;
    }
}
// check number input value
function numberInputVlaide(inputElement) {
    // Check for an existing error message specific to this input
    const existingError = inputElement.parentNode.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }

    // Validate input value
    if (inputElement.value === "" || inputElement.value < 0 || inputElement.value > 100) {

        // Create and insert the error message
        const pError = document.createElement("p");
        pError.textContent = "This input's value should be between 0 and 100";
        pError.classList.add("error-message", "text-red-500"); // Add a class for styling

        inputElement.parentElement.insertBefore(pError, inputElement);
        return false;
    } else {
        return true;
    }
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

    // Ensure all fields are okay
    if (
        inputNotEmpty(document.getElementById("player_name"), "Give the player name!") &&
        notEmptySelect(document.getElementById("nationality_select")) &&
        notEmptySelect(document.getElementById("club_select")) &&
        notEmptySelect(document.getElementById("player_position"))
    ) {

        const numericFields = position === "GK" 
            ? ["rating","diving", "handling", "kicking", "reflexes", "speed", "positioning"] 
            : ["rating","pace", "shooting", "passing", "dribbling", "defending", "physical"];

        let isValid = true;
        // check numeric fields
        numericFields.forEach(fieldId => {
            const inputElement = document.getElementById(fieldId);
            if (!numberInputVlaide(inputElement)) {
                isValid = false;
            }
        });

        // If any numeric field is invalid, stop execution
        if (!isValid) {
            return;
        }

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

        // In case of goalkeepers
        if (position === "GK") {
            newPlayer.diving = parseInt(document.getElementById("diving").value);
            newPlayer.handling = parseInt(document.getElementById("handling").value);
            newPlayer.kicking = parseInt(document.getElementById("kicking").value);
            newPlayer.reflexes = parseInt(document.getElementById("reflexes").value);
            newPlayer.speed = parseInt(document.getElementById("speed").value);
            newPlayer.positioning = parseInt(document.getElementById("positioning").value);
        } else { // For other positions
            newPlayer.pace = parseInt(document.getElementById("pace").value);
            newPlayer.shooting = parseInt(document.getElementById("shooting").value);
            newPlayer.passing = parseInt(document.getElementById("passing").value);
            newPlayer.dribbling = parseInt(document.getElementById("dribbling").value);
            newPlayer.defending = parseInt(document.getElementById("defending").value);
            newPlayer.physical = parseInt(document.getElementById("physical").value);
        }

        const playerId = document.getElementById("save_player_btn").getAttribute("data-player-id");        

        // Create a new player if playerId is empty
        if (playerId === "") {
            newPlayer.id = `player-${players.length + 1}`;
            players.push(newPlayer); // Add new player to the array
            alert("Player added successfully!");
        } else { // Modify an existing player if playerId is not empty
            const playerIndex = players.findIndex(player => player.id === playerId);
            if (playerIndex !== -1) {
                newPlayer.id = playerId; // Keep the same ID
                players[playerIndex] = newPlayer;
                alert("Player updated successfully!");
                document.getElementById("choose_player_modal").classList.add("hidden");
            }
        }

        localStorage.setItem("players", JSON.stringify(players));
        document.getElementById("add_player_modal").classList.add("hidden")


        // Reset the data-player-id attribute
        document.getElementById("save_player_btn").setAttribute("data-player-id", "");
    }
});


// function to show  modification modal  of player
function modifyPlayer(event) {
    // Show the add_player_modal as modify modal
    document.getElementById("add_player_modal").classList.remove("hidden");

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
        document.getElementById("choose_player_modal").classList.add("hidden");
    }  
}

// drag and drop
// Select all draggable player cards and the drop area
// Select all player cards and drop areas
// Select all player cards and drop areas
const dragBoxs = document.querySelectorAll(".player_card");
const dropAreas = document.querySelectorAll(".cart");

// Make the player cards draggable
dragBoxs.forEach(dragBox => {
  dragBox.setAttribute("draggable", true);

  // Add dragstart event
  dragBox.addEventListener("dragstart", function(e) {
    e.dataTransfer.setData("text", dragBox.id); // Store the ID of the dragged element
    
    // Create a custom drag image (you can use the card image or the entire player card)
    const dragImage = document.createElement("img");
    dragImage.src = dragBox.querySelector("img").src; // Get the image source from inside the player card
    dragImage.style.width = "100px"; // Optional: set a custom width for the drag image
    dragImage.style.height = "100px"; // Optional: set a custom height for the drag image
    
    e.dataTransfer.setDragImage(dragImage, 0, 0); // Set custom drag image
    dragBox.classList.add("opacity-50"); // Optional: change appearance of the dragged element
  });

  // Add dragend event
  dragBox.addEventListener("dragend", function() {
    dragBox.classList.remove("opacity-50"); // Reset the appearance
  });
});

// Add event listeners to each drop area
dropAreas.forEach(dropArea => {
  // Prevent the default behavior to allow dropping
  dropArea.addEventListener("dragover", function(e) {
    e.preventDefault();
    dropArea.classList.add("bg-gray-200"); // Optional: change appearance of the drop area
  });

  // Remove the background color after dragover
  dropArea.addEventListener("dragleave", function() {
    dropArea.classList.remove("bg-gray-200");
  });

  // Handle the drop event
  dropArea.addEventListener("drop", function(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text"); // Get the ID of the dragged element
    const draggedElement = document.getElementById(draggedId);

    // Append the dragged element to the drop area
    dropArea.appendChild(draggedElement);

    // Reset the background color
    dropArea.classList.remove("bg-gray-200");
  });
});
