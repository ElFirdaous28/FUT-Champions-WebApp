let localStoragePlayers = JSON.parse(localStorage.getItem("players")) || [];
let squads = JSON.parse(localStorage.getItem("squads")) || [];

function changeFormation(e){
    const formation = e.target.value;
    if(formation==="442"){
        document.getElementById("CM1_cart").classList.replace("translate-y-[-710%]", "translate-y-[-730%]");
        document.getElementById("CM2_cart").classList.replace("translate-y-[-810%]", "translate-y-[-830%]");
        document.getElementById("LW_cart").classList.replace("translate-y-[-1150%]", "translate-y-[-1030%]");
        document.getElementById("LW_cart").querySelector(".position_abr").textContent="LM";
        document.getElementById("LW_cart").setAttribute("data-position","LM");

        document.getElementById("RW_cart").classList.replace("translate-y-[-1350%]", "translate-y-[-1230%]");
        document.getElementById("RW_cart").querySelector(".position_abr").textContent="RM";
        document.getElementById("RW_cart").setAttribute("data-position","RM");

        document.getElementById("CM3_cart").classList.replace("translate-y-[-970%]", "translate-y-[-1050%]");
        document.getElementById("CM3_cart").classList.replace("left-[42%]", "left-[50%]");
        document.getElementById("CM3_cart").querySelector(".position_abr").textContent="ST";
        document.getElementById("CM3_cart").querySelector(".position_abr").id="ST2_cart";
        document.getElementById("CM3_cart").setAttribute("data-position","RM");

        document.getElementById("ST1_cart").classList.replace("left-[42%]", "left-[32%]");
    }
}
function SaveSquad() {
    const formation= document.getElementById("formation_select").value;
    const titleInput= document.getElementById("squad_title");
    const subtitleInput= document.getElementById("squad_subtitle");
    if(inputNotEmpty(titleInput,"Title field is requierd")&&inputNotEmpty(subtitleInput,"Subtitle field is requierd")){
        title=titleInput.value;
        subtitle=subtitleInput.value;
        const newSquad = {
            formation,
            title,
            subtitle,
            principalePlayers: [{position:"RW",id:"player-1"}],
            substitutes: [{position:"RW",id:"player-1"}]
        };
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
    const clickedPlayerId=e.target.closest(".player_item").getAttribute('data-player-id');
    const clickedPlayerPosition=e.target.closest(".player_item").getAttribute('data-player-position');
    
    if(inputNotEmpty(subtitleInput,"Subtitle field is requierd")){
        console.log(squads);
        const currentSauqdIndex = squads.findIndex(sq=>sq.subtitle===subtitleInput.value);
        console.log(squads[currentSauqdIndex]);
        
        if(!squads[currentSauqdIndex].principalePlayers.find(player=>player.id===clickedPlayerId)){
            squads[currentSauqdIndex].principalePlayers.push({position:clickedPlayerPosition,id:clickedPlayerId});
            localStorage.setItem("squads", JSON.stringify(squads));
        }
        else{
            alert("player alredy in squad");
        }
    }
    else{
        choosePlayerModal.classList.add("hidden");
    }  
}

function showPlayers(){
    const playersContainerSelect = document.getElementById("players_container_select");
    const playersContainer = document.getElementById("aside_players_container");
    

    if(playersContainerSelect.value==="squad_substitutes"){
        const squadSubtitle = document.getElementById("squad_subtitle").value;
        const currentSquad = squads.find(squad=>squad.subtitle===squadSubtitle);
               
        playersContainer.innerHTML="";
        
        currentSquad.substitutesIds.forEach(id => {
            const player=localStoragePlayers.find(localStoragePlayer=>localStoragePlayer.id===id);
            playersContainer.innerHTML+=`<div class="player_card relative text-black">
                                             <img src="src/assets/img/badge_gold.webp" alt="">
                                             <!-- position and rating -->
                                             <div class="player_positoin flex flex-col absolute top-[25%] left-[15%]">
                                                 <p class="text-[10px] lg:text-sm font-bold">${player.rating}</p>
                                                 <p class="text-xs lg:text-xs">${player.position}</p> 
                                             </div>
                                             <!-- image -->
                                             <div class="player_image w-2/3 absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                 <img src="${player.photo}" alt="">
                                             </div>
                                             <!-- name and more -->
                                             <div class="w-4/5 flex flex-col items-center absolute top-[63%] left-[10%]">
                                                 <p class="text-xs lg:text-xs md:text-xs font-bold">${player.name}</p>
                                                 <!-- player statistics -->
                                                 <div class="palyer_statistics w-full flex flex-row justify-around text-[6px] lg:text-[0.5em] md:text-[0.5em]">
                                                 <div class="flex flex-col items-center">
                                                     <p class="font-semibold">PAC</p>
                                                     <p class="font-extrabold">80</p> 
                                                 </div>
                                                 <div class="flex flex-col items-center">
                                                     <p class="font-semibold">SHO</p>
                                                     <p class="font-extrabold">87</p> 
                                                 </div>
                                                 <div class="flex flex-col items-center">
                                                     <p class="font-semibold">PAS</p>
                                                     <p class="font-extrabold">90</p> 
                                                 </div>
                                                 <div class="flex flex-col items-center">
                                                     <p class="font-semibold">DRI</p>
                                                     <p class="font-extrabold">94</p> 
                                                 </div>
                                                 <div class="flex flex-col items-center">
                                                     <p class="font-semibold">DEF</p>
                                                     <p class="font-extrabold">33</p> 
                                                 </div>
                                                 <div class="flex flex-col items-center">
                                                     <p class="font-semibold">PHY</p>
                                                     <p class="font-extrabold">64</p> 
                                                 </div>
                                                 </div>
                                                 <!-- flags -->
                                                 <div class="palyer_statistics w-full flex flex-row justify-center gap-2">
                                                 <img src="https://cdn.sofifa.net/flags/pt.png" width="10%" alt="">
                                                 <img src="https://cdn.sofifa.net/meta/team/271/30.png" width="10%" alt="">
                                                 <img src="https://cdn.sofifa.net/meta/team/2506/120.png" width="10%" alt="">
                                                 </div>
                                             </div>
                                             </div>` 
         })
    }
    else if(playersContainerSelect.value==="all_players"){        
        playersContainer.innerHTML="";
        localStoragePlayers.forEach(player => {
           playersContainer.innerHTML+=`<div class="player_card relative text-black">
                                            <img src="src/assets/img/badge_gold.webp" alt="">
                                            <!-- position and rating -->
                                            <div class="player_positoin flex flex-col absolute top-[25%] left-[15%]">
                                                <p class="text-[10px] lg:text-sm font-bold">${player.rating}</p>
                                                <p class="text-xs lg:text-xs">${player.position}</p> 
                                            </div>
                                            <!-- image -->
                                            <div class="player_image w-2/3 absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <img src="${player.photo}" alt="">
                                            </div>
                                            <!-- name and more -->
                                            <div class="w-4/5 flex flex-col items-center absolute top-[63%] left-[10%]">
                                                <p class="text-xs lg:text-xs md:text-xs font-bold">${player.name}</p>
                                                <!-- player statistics -->
                                                <div class="palyer_statistics w-full flex flex-row justify-around text-[6px] lg:text-[0.5em] md:text-[0.5em]">
                                                <div class="flex flex-col items-center">
                                                    <p class="font-semibold">PAC</p>
                                                    <p class="font-extrabold">80</p> 
                                                </div>
                                                <div class="flex flex-col items-center">
                                                    <p class="font-semibold">SHO</p>
                                                    <p class="font-extrabold">87</p> 
                                                </div>
                                                <div class="flex flex-col items-center">
                                                    <p class="font-semibold">PAS</p>
                                                    <p class="font-extrabold">90</p> 
                                                </div>
                                                <div class="flex flex-col items-center">
                                                    <p class="font-semibold">DRI</p>
                                                    <p class="font-extrabold">94</p> 
                                                </div>
                                                <div class="flex flex-col items-center">
                                                    <p class="font-semibold">DEF</p>
                                                    <p class="font-extrabold">33</p> 
                                                </div>
                                                <div class="flex flex-col items-center">
                                                    <p class="font-semibold">PHY</p>
                                                    <p class="font-extrabold">64</p> 
                                                </div>
                                                </div>
                                                <!-- flags -->
                                                <div class="palyer_statistics w-full flex flex-row justify-center gap-2">
                                                <img src="https://cdn.sofifa.net/flags/pt.png" width="10%" alt="">
                                                <img src="https://cdn.sofifa.net/meta/team/271/30.png" width="10%" alt="">
                                                <img src="https://cdn.sofifa.net/meta/team/2506/120.png" width="10%" alt="">
                                                </div>
                                            </div>
                                            </div>` 
        });
    }
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
        let PlayerPosition = e.target.closest("button").parentElement.getAttribute("data-position");
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