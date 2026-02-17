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

// Load from localStorage or create default
let players = {};
localStorage.setItem("players", JSON.stringify(players));

// Function to populate dropdown
// function populateDropdown() {
//     const select = document.getElementById("playerSelect");
//     select.innerHTML = "";

//     const placeholder = document.createElement("option");
//     placeholder.textContent = "Select a player";
//     placeholder.value = "";
//     placeholder.disabled = true;
//     placeholder.selected = true;
//     select.appendChild(placeholder);

//     players.forEach(player => {
//         const option = document.createElement("option");
//         option.value = player;
//         option.textContent = player;
//         select.appendChild(option);
//     });
// }

// // Populate on page load
// populateDropdown();

// Load JSON file into localStorage
document.getElementById("loadBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("jsonFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a JSON file!");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            if (!Array.isArray(jsonData)) throw "JSON must be an array of player names";

            players=jsonData.map(name=> ({
                name:name
            }));
            //players = jsonData;
            localStorage.setItem("players", JSON.stringify(players));
            //populateDropdown();
            alert("JSON loaded successfully!");
            
            startGame();
        } catch (err) {
            alert("Invalid JSON file!");
            console.error(err);
        }
    };
    reader.readAsText(file);
});

// let players = [
//     { name: "Player 1", life: 20 },
//     { name: "Player 2", life: 20 },
//     { name: "Player 3", life: 20 }

//   // Add up to 4 players here
// ];

function setLifeTotal(){
    players.forEach((player)=>{
        player.life=20;
        console.log(player.name);
    })
}

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

  container.innerHTML = "";

  players.forEach((player, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player";

    playerDiv.innerHTML = `
      <div class="zone plus" data-index="${index}" data-change="1">+</div>
      <div class="life">${player.name} ${player.life}</div>
      <div class="zone minus" data-index="${index}" data-change="-1">-</div>
    `;

    container.appendChild(playerDiv);
  });
}

// Single event listener (clean + scalable)
document.getElementById("lifeContainer").addEventListener("click", (e) => {
  if (e.target.classList.contains("zone")) {
    const index = e.target.dataset.index;
    const change = Number(e.target.dataset.change);

    players[index].life += change;
    renderPlayers();
  }
});

function startGame(){
    setLifeTotal();
    renderPlayers();
}
