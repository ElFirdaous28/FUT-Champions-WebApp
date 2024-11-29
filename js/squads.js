let squads = JSON.parse(localStorage.getItem("squads")) || [];
console.log(squads);

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
    const newSquad = {
        formation: document.getElementById("formation_select").value,
        title: document.getElementById("squad_title").value,
        subtitle: document.getElementById("squad_subtitle").value,
        principalePlayers: [],
        substitutes: []
    };
    // check if subtitle does not existe
    const existingSquad = squads.find(squad => squad.subtitle === newSquad.subtitle);
    
    if (existingSquad) {
        alert("A squad with this subtitle already exists!");
        return;// return to not save
    }

    squads.push(newSquad);
    localStorage.setItem("squads", JSON.stringify(squads));
}


function addPlyerToSquad(){
}