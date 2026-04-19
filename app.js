
//MENU BUTTON==========


const modal = document.getElementById("modal"); //modal menu
const openBtn = document.getElementById("openModalBtn");
const closeBtn = document.getElementById("closeModalBtn");
const modalPlayerSelect=document.getElementById("playerAndDeckSelect"); //player and deck select on modal
const modalPlayerCountSelect=document.getElementById("playerCount"); //player count select modal
const container = document.getElementById("lifeContainer");
const turnDisplay = document.getElementById("turnCount");
const turnPlus = document.getElementById("turnPlus");
const turnMinus = document.getElementById("turnMinus");

openBtn.addEventListener("click", () => {
  //main menu
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

//MENU BUTTON END==========

//******************
//*****DATA SET*****
//TEST DATA SET*****

const testPlayersSet=["none"]

//TEST DATA SET END*****

// Load from localStorage or create default
let turnCount=0;
let clickLocked=false;
let currentView=-1;
const players = [];
const cmdDMG=[]; //[selectedPlayerIndex][j/i receiving damage from]
const savedPlayers=["maynard", "leonard", "bernard", "richard"];
localStorage.setItem("players", JSON.stringify(players));
let gameObj=[];

//*****DATA SET END*****
//******************

// Function to populate dropdown
let currentPlayerIndex = null;

document.getElementById("playerSelect").addEventListener("change", (e) => {

    var newName = e.target.value;

    if(newName==="__custom__"){
      const name = prompt("Enter a new player name:");
      if (name && name.trim() !== "") {
      newName = name.trim();
      }else{
        newName="-----";
      }
      // Save it
      if (!savedPlayers.includes(newName)&&newName!="-----") {
        savedPlayers.push(newName);
      }
    }

    if (currentPlayerIndex !== null) {
      players[currentPlayerIndex].name = newName;
      renderPlayers();
      modal.style.display = "none";
      modalPlayerCountSelect.style.display="none";
      modalPlayerSelect.style.display = "none";
    }

    //modalPlayerSelect.style.display = "none";
  });

function populateDropdown(playerIndex) {
  currentPlayerIndex=playerIndex;
  const select = document.getElementById("playerSelect");
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.textContent = "Select a player";
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);
  savedPlayers.forEach(player => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    select.appendChild(option);
  });

  const customOption = document.createElement("option");
  customOption.value = "__custom__";
  customOption.textContent = "Enter new name...";
  select.appendChild(customOption);

}

function renderPlayers() {
  currentView=-1;
  document.getElementById("turnCount").textContent = turnCount;  
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
    
    // Create name div
    if(players[i].dead==true){
      const nameDiv = document.createElement("div");
      nameDiv.className = "player-name";
      const img = document.createElement("img");
      img.src = "images/dead.jpg";   // path to your image
      img.classList.add("dead-img");
      img.style.width = "100px";
      img.style.pointerEvents = "none"; // so clicks still hit the div

      life.appendChild(img);

      nameDiv.dataset.index = i;
    }else{
      const nameDiv = document.createElement("div");
      nameDiv.className = "player-name";
      nameDiv.textContent = player.name;
      nameDiv.dataset.index = i;

      // Create life total div
      const lifeTotalDiv = document.createElement("div");
      lifeTotalDiv.dataset.index = i;
      lifeTotalDiv.className = "player-life";
      lifeTotalDiv.textContent = player.life;

      // Append both to parent
      life.appendChild(nameDiv);
      life.appendChild(lifeTotalDiv);
    }
    

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
  const index = e.target.dataset.index;
  if (e.target.classList.contains("zone")) {
    
    const change = Number(e.target.dataset.change);

    if (currentView<0) {
      players[index].life += change;
      renderPlayers();
    }else{
      cmdDMG[currentView][index] += change;
      renderCommandMenu(currentView);
    }
  }
  if (e.target.classList.contains("player-name")){
    console.log("testchangeplayer");
    populateDropdown(e.target.dataset.index);
    modal.style.display = "block";
    modalPlayerSelect.style.display = "block";
  }

  if (e.target.classList.contains("player-life")){
    console.log("gameEnd?");
    console.log("currentView "+currentView);
    //commander damage func here
    if(currentView<0){
      console.log("preCMD");
      console.log(Number(e.target.dataset.index));
      renderCommandMenu(Number(e.target.dataset.index));
      return;
    }
    if(currentView>=0){
      console.log("postCMD");
      renderPlayers();
      return;
    }
  }

  if(e.target.classList.contains("dead")){
    // prevent adding multiple images
    if (!e.target.querySelector(".dead-img")) {
        const img = document.createElement("img");
        img.src = "images/dead.jpg";   // path to your image
        img.classList.add("dead-img");
        players[index].dead=true;
        img.style.width = "100px";

        e.target.appendChild(img);
    }
  }

  if(e.target.classList.contains("dead-img")){
    if(currentView>=0){
      console.log("deadIMGclick");
      renderPlayers();
      return;
    }
  }
});

function startGame(intVal){
  turnCount=0;
    for(i=0;i<intVal;i++){
      players[i]={name:testPlayersSet[0], life:40, dead:false};
      cmdDMG[i] = Array(intVal).fill(0);
    }
    renderPlayers()
}

function renderCommandMenu(selectedPlayerIndex){

  currentView=selectedPlayerIndex;
    
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

    if(players[i].dead==true){
      const nameDiv = document.createElement("div");
      nameDiv.className = "cmdrDMG";
      const img = document.createElement("img");
      img.src = "images/dead.jpg";   // path to your image
      img.classList.add("dead-img");
      img.style.width = "100px";
      img.style.pointerEvents = "none"; // so clicks still hit the div

      life.appendChild(img);
    }else{
      if(i!=selectedPlayerIndex){
        // Create name div
        const nameDiv = document.createElement("div");
        nameDiv.className = "cmdrDMG";
        nameDiv.textContent = "cmdr ";
        nameDiv.dataset.index = i;

        // Create life total div
        const lifeTotalDiv = document.createElement("div");
        lifeTotalDiv.className = "player-life";
        lifeTotalDiv.dataset.index = i;
        lifeTotalDiv.textContent = cmdDMG[selectedPlayerIndex][i];

        // Append both to parent
        life.appendChild(nameDiv);
        life.appendChild(lifeTotalDiv);
      }else{
        const nameDiv = document.createElement("div");
        nameDiv.className = "dead";
        nameDiv.textContent = "dead?";
        nameDiv.dataset.index = i;
        life.appendChild(nameDiv);
      }
    }
    
    
    const minus = document.createElement("div");
    minus.className = "zone minus";
    minus.dataset.index = i;
    minus.dataset.change = -1;
    minus.textContent = "-";

    playerDiv.append(plus, life, minus);
    container.appendChild(playerDiv);
  });
}

turnPlus.addEventListener("click", () => {
  turnCount++;
  console.log("count:", turnCount);
  turnDisplay.textContent = turnCount;
  renderPlayers();
});

turnMinus.addEventListener("click", () => {
  if (turnCount > 0) turnCount--;
  turnDisplay.textContent = turnCount;
  renderPlayers();
});


