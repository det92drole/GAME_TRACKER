
//MENU BUTTON==========
const modal = document.getElementById("modal"); //modal menu
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const modalPlayerSelect=document.getElementById("playerAndDeckSelect"); //player and deck select on modal
const modalPlayerCountSelect=document.getElementById("playerCount"); //player count select modal

openBtn.addEventListener("click", () => {
    modal.style.display = "block";
    modalPlayerCountSelect.style.display="block";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalPlayerCountSelect.style.display="none";
    modalPlayerSelect.style.display = "none";

});

// Close if user clicks outside modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        modalPlayerCountSelect.style.display="none";
        modalPlayerSelect.style.display = "none";

    }
    
});


//HOW MANY PLAYERS?
document.getElementById("numPlayer2").addEventListener("click", ()=>{
    players.length=0;
    const container = document.getElementById("lifeContainer");
    container.innerHTML = "";  // clear container
    startGame(2);
})
document.getElementById("numPlayer3").addEventListener("click", ()=>{
    players.length=0;
    const container = document.getElementById("lifeContainer");
    container.innerHTML = "";  // clear container

    startGame(3);
})
document.getElementById("numPlayer4").addEventListener("click", ()=>{
    players.length=0;
    const container = document.getElementById("lifeContainer");
    container.innerHTML = "";  // clear container

    startGame(4);
})

//MENU BUTTON==========

//******************
//*****DATA SET*****
//TEST DATA SET*****

const testPlayersSet=["none"]

//TEST DATA SET END*****

// Load from localStorage or create default
const players = [];
localStorage.setItem("players", JSON.stringify(players));

//*****DATA SET END*****
//******************

function renderPlayers() {
  const container = document.getElementById("lifeContainer");
    
  // Adjust grid layout based on player count
  if (players.length <= 2) {
    container.style.gridTemplateColumns = "1fr";
    container.style.gridTemplateRows = "1fr 1fr";
  } else {
    container.style.gridTemplateColumns = "1fr 1fr";
    container.style.gridTemplateRows = "1fr 1fr";
  }


  container.innerHTML = "";  // clear container
  players.forEach((player, i) => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";

    const plus = document.createElement("div");
    plus.className = "zone plus";
    plus.dataset.index = i;
    plus.dataset.change = 1;
    plus.textContent = "+";

    const life = document.createElement("div");
    life.className = "life";
    life.dataset.index = i;
    life.textContent = `${player.name} ${player.life}`;

    const minus = document.createElement("div");
    minus.className = "zone minus";
    minus.dataset.index = i;
    minus.dataset.change = -1;
    minus.textContent = "-";

    playerDiv.append(plus, life, minus);
    container.appendChild(playerDiv);
  });
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
  if (e.target.classList.contains("life")){
        modal.style.display = "block";
        modalPlayerSelect.style.display = "block";

  }
});

function startGame(intVal){
    for(i=0;i<intVal;i++){
        players[i]={name:testPlayersSet[0], life:20};
        
    }
    renderPlayers()
}

