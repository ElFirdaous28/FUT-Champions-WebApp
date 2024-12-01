let localStoragePlayers = JSON.parse(localStorage.getItem("players")) || [];
let squads = JSON.parse(localStorage.getItem("squads")) || [];
let clickedPosition;

function changeFormation(e) {
    const formation = e.target.value;

    // Define mappings for each formation
    const formations = {
        "4-4-2": [
            { oldId: "RW", newId: "LM", newPosition: "LM" },
            { oldId: "CM2", newId: "RM", newPosition: "RM" },
            { oldId: "LW", newId: "ST", newPosition: "ST" },
        ],
        "4-3-3": [
            { oldId: "LM", newId: "RW", newPosition: "RW" },
            { oldId: "RM", newId: "CM2", newPosition: "CM2" },
            { oldId: "ST", newId: "LW", newPosition: "LW" },
        ],
    };

    // Apply the transformation if the formation is defined
    if (formations[formation]) {
        formations[formation].forEach(({ oldId, newId, newPosition }) => {
            const element = document.getElementById(oldId);
            if (element) {
                element.querySelector(".position_abr").textContent = newPosition;
                element.setAttribute("data-position", newPosition);
                element.id = newId;
            }
        });
    }
}

function SaveSquad() {
    const formation= document.getElementById("formation_select").value;
    const titleInput= document.getElementById("squad_title");
    const subtitleInput= document.getElementById("squad_subtitle");
    if(inputNotEmpty(titleInput,"Title field is requierd")&&inputNotEmpty(subtitleInput,"Subtitle field is requierd")){
        title=titleInput.value;
        subtitle=subtitleInput.value;
        let newSquad;
        if(formation==="4-3-3"){
            newSquad = {
                formation,
                title,
                subtitle,
                principalePlayers: {
                    GK: "",
                    LB: "",
                    CB1: "",
                    CB2: "",
                    RB: "",
                    CM1: "",
                    CM2: "",
                    CM3: "",
                    LW: "",
                    ST: "",
                    RW: ""
                },
                substitutesPlayers: {
                    GK: [],
                    LB: [],
                    CB1: [],
                    CB2: [],
                    RB: [],
                    CM1: [],
                    CM2: [],
                    CM3: [],
                    LW: [],
                    ST: [],
                    RW: []
                }
            };
        }
        else if(formation==="4-4-2"){
            newSquad = {
                formation,
                title,
                subtitle,
                principalePlayers: {
                    GK: [],
                    LB: [],
                    CB1: [],
                    CB2: [],
                    RB: [],
                    LM: [],
                    CM1: [],
                    CM2: [],
                    RM: [],
                    ST1: [],
                    ST2: []
                },
                substitutesPlayers: {
                    GK: [],
                    LB: [],
                    CB1: [],
                    CB2: [],
                    RB: [],
                    LM: [],
                    CM1: [],
                    CM2: [],
                    RM: [],
                    ST1: [],
                    ST2: []
                }
            };
        }
        // check if subtitle does not existe
        const existingSquad = squads.find(squad => squad.subtitle === newSquad.subtitle);    
        if (existingSquad) {
            alert("A squad with this subtitle already exists\nmodify current squad or creat a new one!!");
            return;// return to not save
        }
    
        squads.push(newSquad);
        localStorage.setItem("squads", JSON.stringify(squads));
        alert(subtitle+" squad added!")
    }
}

function addPlayerToSquad(e){    
    const choosePlayerModal = document.getElementById("choose_player_modal");
    const subtitleInput = document.getElementById("squad_subtitle");
    
    if(inputNotEmpty(subtitleInput,"Subtitle field is requierd")){
        const currentSquadIndex = squads.findIndex(sq=>sq.subtitle===subtitleInput.value);
        
        // add to priciple        
        if(e.target.closest(".player_item").parentElement.id==="add_to_principale"){
            const clickedPlayerId=e.target.closest(".player_item").getAttribute('data-player-id'); 
            squads[currentSquadIndex].principalePlayers[clickedPosition]=clickedPlayerId;                
            localStorage.setItem("squads", JSON.stringify(squads));
            console.log("player added");              
        }
        // add to substitues
        if(e.target.closest(".player_item").parentElement.id==="add_to_substitues"){
            const clickedPlayerId=e.target.closest(".player_item").getAttribute('data-player-id');
            console.log(clickedPosition); 
            if(!squads[currentSquadIndex].substitutesPlayers[clickedPosition].find(id=>id===clickedPlayerId)&& !Object.values(squads[currentSquadIndex].principalePlayers).includes(clickedPlayerId)){
                // !Object.valuestake object and return array of values
                squads[currentSquadIndex].substitutesPlayers[clickedPosition].push(clickedPlayerId);
                localStorage.setItem("squads", JSON.stringify(squads));
            }  
            else{
                console.log("player alredy in ");   
            }         
        }
    }
    else{
        choosePlayerModal.classList.add("hidden");
    }  
}

// function to remove player from squad
function removeFromSquad(e){ 
    const subtitleInput = document.getElementById("squad_subtitle");
    if(inputNotEmpty(subtitleInput,"Subtitle field is requierd")){
        const currentSquadIndex = squads.findIndex(sq=>sq.subtitle===subtitleInput.value);
        const playerId = e.target.parentElement.parentElement.getAttribute("data-player-id");
        
        // Remove from principalePlayers if player exists
        const principalePlayers = squads[currentSquadIndex].principalePlayers;
        for (let position in principalePlayers) {
            if (principalePlayers[position] === playerId) {
                principalePlayers[position] = ""; // Remove player from principale position
                console.log(`Player removed from principale at ${position}`);
            }
        }
        // Remove from substitutes if player exists
        const substitutesPlayers = squads[currentSquadIndex].substitutesPlayers;
        for (let position in substitutesPlayers) {
            const playerIndex = substitutesPlayers[position].indexOf(playerId);
            if (playerIndex !== -1) {
                substitutesPlayers[position].splice(playerIndex, 1);
                console.log(`Player removed from substitutes at ${position}`);
            }
        }
        showPlayers();
        localStorage.setItem("squads", JSON.stringify(squads));       
    }   
}

// 
function changePlayerRole(e) {
    const subtitleInput = document.getElementById("squad_subtitle");
    
    if (inputNotEmpty(subtitleInput, "Subtitle field is required")){
        const currentSquadIndex = squads.findIndex(sq => sq.subtitle === subtitleInput.value);
        const playerId = e.target.parentElement.parentElement.getAttribute("data-player-id");
        const playerPosition = e.target.parentElement.parentElement.id;
        console.log(e.target.parentElement.parentElement);
        
        console.log(playerId,playerPosition);
        console.log(squads[currentSquadIndex].principalePlayers[playerPosition]);
        
        if (squads[currentSquadIndex].principalePlayers[playerPosition]===playerId) {
            // remove from principale
            squads[currentSquadIndex].principalePlayers[playerPosition] = "";
            // Add  to substitutes
            if (!squads[currentSquadIndex].substitutesPlayers[playerPosition].includes(playerId)) {
                squads[currentSquadIndex].substitutesPlayers[playerPosition].push(playerId);
                console.log(e.target.parentElement);
                
            }
            console.log(`Moved player ${playerId} from ${playerPosition} in principale to substitutes`);

            // Save updated squads back to localStorage (optional)
            localStorage.setItem("squads", JSON.stringify(squads));
        }
        
    }
}

function showPlayers() {
    const playersContainerSelect = document.getElementById("players_container_select");
    const playersContainer = document.getElementById("aside_players_container");
    playersContainer.innerHTML = ""; // Clear the container initially

    if (playersContainerSelect.value === "squad_substitutes") {
        const squadSubtitleInput = document.getElementById("squad_subtitle");

        if (inputNotEmpty(squadSubtitleInput, "Choose a squad first!")) {
            const currentSquad = squads.find(squad => squad.subtitle === squadSubtitleInput.value);
            const currentSquadPlayersIds = [].concat(...Object.values(currentSquad.substitutesPlayers));

            currentSquadPlayersIds.forEach(id => {
                const player = localStoragePlayers.find(localStoragePlayer => localStoragePlayer.id === id);
                if (player) playersContainer.innerHTML += generatePlayerCard(player,"substitut");
            });
        }
    } else if (playersContainerSelect.value === "all_players") {
        localStoragePlayers.forEach(player => {
            playersContainer.innerHTML += generatePlayerCard(player,"principlae");
        });
    }
}

function generatePlayerCard(player,role) {
    const statisticsHTML = player.position.includes('GK') 
        ? `
            <div class="player_statistics w-full flex flex-row justify-between text-[0.3rem] lg:text-[0.5em] md:text-[0.08em]">
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">DIV</p><p class="font-extrabold">${player.diving}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">HAN</p><p class="font-extrabold">${player.handling}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">KIC</p><p class="font-extrabold">${player.kicking}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">REF</p><p class="font-extrabold">${player.reflexes}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">SPD</p><p class="font-extrabold">${player.speed}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">POS</p><p class="font-extrabold">${player.positioning}</p></div>
            </div>
        `
        : `
            <div class="player_statistics w-full flex flex-row justify-between text-[0.3rem] lg:text-[0.5em] md:text-[0.08em]">
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">PAC</p><p class="font-extrabold">${player.pace}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">SHO</p><p class="font-extrabold">${player.shooting}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">PAS</p><p class="font-extrabold">${player.passing}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">DRI</p><p class="font-extrabold">${player.dribbling}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">DEF</p><p class="font-extrabold">${player.defending}</p></div>
                <div class="flex flex-col items-center -space-y-[0.1rem]"><p class="font-semibold">PHY</p><p class="font-extrabold">${player.physical}</p></div>
            </div>
        `;

    return `
        <div class="player_card relative text-black ${role === "substitut" ? "group" : " "}">
            ${role === "substitut" ? `
                <div class="text-[#eee] translate-y-5 flex justify-end invisible group-hover:visible">
                    <i data-player-id="${player.id}" onclick="removeFromSquad(event)" class="fas fa-times cursor-pointer mr-5" title="remove from squad"></i>
                </div>
            ` : ""}
            <img src="src/assets/img/badge_gold.webp" alt="">
            <div class="player_positoin flex flex-col absolute top-[25%] left-[15%] -space-y-1">
                <p class="text-[0.5rem] lg:text-xs md:text-[0.6rem] font-bold">${player.rating}</p>
                <p class="text-[0.5rem] lg:text-xs md:text-[0.6rem]">${player.position[0]}</p>
            </div>
            <div class="player_image w-2/3 absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img src="${player.photo}" alt="${player.name}">
            </div>
            <div class="w-4/5 flex flex-col items-center absolute top-[60%] lg:top-[62%] md:top-[60%] left-[10%]">
                <p class="text-[0.5rem] lg:text-xs md:text-[0.6rem] font-bold">${player.name}</p>
                ${statisticsHTML}
                <div class="palyer_statistics w-full flex flex-row justify-center gap-2">
                    <img src="${player.flag}" width="10%" alt="${player.nationality}">
                    <img src="${player.logo}" width="10%" alt="${player.club}">
                </div>
            </div>
        </div>
    `;
}


document.addEventListener("DOMContentLoaded",showPlayers());


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

// show choose_player_modal 
function choosePlayerModal(e){
    const subtitleInput = document.getElementById("squad_subtitle");    
    const currentSquad = squads.find(sq=>sq.subtitle===subtitleInput.value);
    if(inputNotEmpty(subtitleInput,"Enter the squad subtitle or create a new squad")&&!currentSquad){
        alert("This squad does not exite yet!")
    }
    if(inputNotEmpty(subtitleInput,"Enter the squad subtitle or create a new squad")&&currentSquad){
        const choosePlayerModal=document.getElementById("choose_player_modal");
        const playersContainer = document.getElementById("players_container");
        
        choosePlayerModal.classList.remove("hidden");
        clickedPosition=e.target.closest(".player_card").id;        

        let PlayerPosition = e.target.tagName === "I" ? e.target.parentElement.parentElement.getAttribute("data-position") : e.target.closest("button").parentElement.getAttribute("data-position");
        playersContainer.id= e.target.tagName === "I" ? "add_to_substitues" : "add_to_principale";
        playersContainer.innerHTML="";
        
        players.forEach(player => {
            if(player.position.includes(PlayerPosition)){            
                const positions = player.position.join(' / ');            
                playersContainer.innerHTML+=`<div data-player-id=${player.id} data-player-position =${player.position} class="player_item flex items-center justify-between p-2 bg-neutral-700 rounded-lg cursor-pointer">
                                                    <div onclick="addPlayerToSquad(event)" class="flex items-center">
                                                        <!-- Player Image -->
                                                        <img alt="Image of player" class="w-16 h-16 rounded-full" height="40" src="${player.photo || 'https://via.placeholder.com/150?text=No+Image'}" width="40"/>

                                                        <!-- Player Info -->
                                                        <div class="ml-4">
                                                            <div class="text-white font-semibold w-52">${player.name}</div>
                                                        </div>
                                                    </div>

                                                    <div class="flex">
                                                        <!-- Player Position -->
                                                        <div class="text-gray-400 mr-4">${positions}</div>

                                                        <!-- Flag and Club Logo -->
                                                        <div class="flex space-x-2">
                                                            <img alt="Flag" class="w-5 h-5" height="20" width="30" src="${player.flag || 'https://via.placeholder.com/150?text=No+Image'}"/>
                                                            <img alt="Club logo" class="w-5 h-5" height="20" width="30" src="${player.logo || 'https://via.placeholder.com/150?text=No+Image'}"/>
                                                        </div>
                                                    </div>

                                                    <div class="flex gap-x-4">
                                                        <button data-player-id="${player.id}" onclick="modifyPlayer(event)">
                                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 24 24">
                                                                <path fill="#FFFFFF" d="M 18.414062 2 C 18.158062 2 17.902031 2.0979687 17.707031 2.2929688 L 15.707031 4.2929688 L 14.292969 5.7070312 L 3 17 L 3 21 L 7 21 L 21.707031 6.2929688 C 22.098031 5.9019687 22.098031 5.2689063 21.707031 4.8789062 L 19.121094 2.2929688 C 18.926094 2.0979687 18.670063 2 18.414062 2 z M 18.414062 4.4140625 L 19.585938 5.5859375 L 18.292969 6.8789062 L 17.121094 5.7070312 L 18.414062 4.4140625 z M 15.707031 7.1210938 L 16.878906 8.2929688 L 6.171875 19 L 5 19 L 5 17.828125 L 15.707031 7.1210938 z"></path>
                                                            </svg>
                                                        </button>

                                                        <button data-player-id="${player.id}" onclick="removePlayer(event)">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 11V17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14 11V17" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M4 7H20" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>`
            }
        });   
    }
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

function showPlayersOnCampo() {
    const playerCart = document.querySelectorAll(".cart");
    const squadSubtitle = document.getElementById("squad_subtitle").value;
    if(squadSubtitle!==""){
        const currentSquadIndex=squads.findIndex(sq=>sq.subtitle===squadSubtitle);
        
       if(currentSquadIndex!==-1){
        // block formation select and show squad formation
        document.getElementById("formation_select").disabled = true;        
        document.getElementById("formation_select").value = squads[currentSquadIndex].formation;
        playerCart.forEach((cart) => {
            if (squads[currentSquadIndex].principalePlayers[cart.id] !== "") {
                const playerId = squads[currentSquadIndex].principalePlayers[cart.id];
                const playerData = players.find(player => player.id === playerId);
    
                cart.setAttribute("data-player-id",playerData.id);
                    
                if (playerData.position.includes("GK")) {
                    // show GK data
                    cart.innerHTML = `
                    <div class="text-[#eee] translate-y-5 flex justify-around invisible group-hover:visible">
                        <i class="fas fa-plus cursor-pointer" onclick="choosePlayerModal(event)" title="add substitute at position"></i>
                        <i onclick="changePlayerRole(event)" class="fas fa-exchange-alt cursor-pointer" title="make substitute"></i>
                        <i onclick="removeFromSquad(event)" class="fas fa-times cursor-pointer" title="remove from squad"></i>
                    </div>
                    <img src="src/assets/img/badge_gold.webp" alt="">
                    <!-- position and number -->
                    <div class="player_positoin flex flex-col absolute top-[30%] left-[12%] text-[0.65em] -space-y-1">
                        <p class="font-bold">${playerData.rating}</p>
                        <p>${playerData.position[0]}</p> 
                    </div>
                    <!-- image -->
                    <div class="player_image w-2/3 absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <img src="${playerData.photo}" alt="">
                    </div>
                    <!-- name and more -->
                    <div class="w-4/5 flex flex-col items-center absolute top-[64%] left-[10%]">
                        <p class="text-[0.53em] font-bold">${playerData.name}</p>
                        <!-- player statistics -->
                        <div class="palyer_statistics w-full flex flex-row justify-between text-[0.1em] -mt-1">
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">DIV</p>
                            <p class="font-extrabold">${playerData.diving}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">HAN</p>
                            <p class="font-extrabold">${playerData.handling}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">KIC</p>
                            <p class="font-extrabold">${playerData.kicking}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">REF</p>
                            <p class="font-extrabold">${playerData.reflexes}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">SPD</p>
                            <p class="font-extrabold">${playerData.speed}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">POS</p>
                            <p class="font-extrabold">${playerData.positioning}</p> 
                          </div>
                        </div>
                        <!-- flags -->
                        <div class="palyer_statistics w-full flex flex-row justify-center gap-2">
                            <img src="${playerData.flag}" width="8%" alt="">
                            <img src="${playerData.logo}" width="8%" alt="">
                        </div>
                    </div>
                    <div class="position_abr text-[#eee] text-center -mt-2 font-medium text-xs">${playerData.position[0]}</div>
                    `;
                } else {
                    // show data
                    cart.innerHTML = `
                    <div class="text-[#eee] translate-y-5 flex justify-around invisible group-hover:visible">
                        <i class="fas fa-plus cursor-pointer" onclick="choosePlayerModal(event)" title="add substitute at position"></i>
                        <i onclick="changePlayerRole(event)" class="fas fa-exchange-alt cursor-pointer" title="make substitute"></i>
                        <i onclick="removeFromSquad(event)" class="fas fa-times cursor-pointer" title="remove from squad"></i>
                    </div>
                    <img src="src/assets/img/badge_gold.webp" alt="">
                    <!-- position and number -->
                    <div class="player_positoin flex flex-col absolute top-[30%] left-[12%] text-[0.65em] -space-y-1">
                        <p class="font-bold">${playerData.rating}</p>
                        <p>${playerData.position[0]}</p> 
                    </div>
                    <!-- image -->
                    <div class="player_image w-2/3 absolute top-[44%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <img src="${playerData.photo}" alt="">
                    </div>
                    <!-- name and more -->
                    <div class="w-4/5 flex flex-col items-center absolute top-[62%] left-[10%]">
                        <p class="text-[0.53em] font-bold">${playerData.name}</p>
                        <!-- player statistics -->
                        <div class="palyer_statistics w-full flex flex-row justify-between text-[0.1em] -mt-]0.2rem]">
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">PAC</p>
                            <p class="font-extrabold">${playerData.pace}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">SHO</p>
                            <p class="font-extrabold">${playerData.shooting}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">PAS</p>
                            <p class="font-extrabold">${playerData.passing}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">DRI</p>
                            <p class="font-extrabold">${playerData.dribbling}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">DEF</p>
                            <p class="font-extrabold">${playerData.defending}</p> 
                          </div>
                          <div class="flex flex-col items-center -space-y-[0.1rem]">
                            <p class="font-semibold">PHY</p>
                            <p class="font-extrabold">${playerData.physical}</p> 
                          </div>
                        </div>
                        <!-- flags -->
                        <div class="palyer_statistics w-full flex flex-row justify-center gap-2">
                            <img src="${playerData.flag}" width="8%" alt="">
                            <img src="${playerData.logo}" width="8%" alt="">
                        </div>
                    </div>
                    <div class="position_abr text-[#eee] text-center -mt-2 font-medium text-xs">${playerData.position[0]}</div>
                    `;
                }
            }
        });
       }
       else{
        document.getElementById("formation_select").disabled = true;
       }
    }
}

showPlayersOnCampo()