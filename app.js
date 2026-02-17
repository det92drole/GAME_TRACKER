
//MENU BUTTON==========
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");

openBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close if user clicks outside modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


//HOW MANY PLAYERS?
document.getElementById("numPlayer2").addEventListener("click", ()=>{
    renderPlayers(2);
})
document.getElementById("numPlayer3").addEventListener("click", ()=>{
    renderPlayers(3);
})
document.getElementById("numPlayer4").addEventListener("click", ()=>{
    renderPlayers(4);
})

//MENU BUTTON==========

// Load from localStorage or create default
let players = {};
localStorage.setItem("players", JSON.stringify(players));

function setLifeTotal(){
    players.forEach((player)=>{
        player.life=20;
        //console.log(player.name);
    })
}

function renderPlayers(intVal) {
  const container = document.getElementById("lifeContainer");

  // Adjust grid layout based on player count
  if (intVal <= 2) {
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = "1fr 1fr";
  } else {
    container.style.gridTemplateColumns = "1fr 1fr";
    container.style.gridTemplateRows = "1fr 1fr";
  }

  container.innerHTML = "";

  for(i=0;i<intVal;i++){
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";

    playerDiv.innerHTML = `
      <div class="zone plus" data-index="${i}" data-change="1">+</div>
      <div class="life">selectplayer lifeTotal</div>
      <div class="zone minus" data-index="${i}" data-change="-1">-</div>
    `;

    container.appendChild(playerDiv); 
  }
}

// Single event listener (clean + scalable) for life points
document.getElementById("lifeContainer").addEventListener("click", (e) => {
  if (e.target.classList.contains("zone")) {
    const index = e.target.dataset.index;
    const change = Number(e.target.dataset.change);
console.log("lifechange");
    players[index].life += change;
    renderPlayers();
  }
});



function startGame(){
    setLifeTotal();
    renderPlayers();
}
