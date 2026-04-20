// DECLARED VARIABLES:

const modal = document.getElementById("modal"); //modal menu
const closeMenuBtn = document.getElementById("closeModalBtn");
const modalPlayerCountSelect = document.getElementById("playerCount"); //player count select modal
const menuBtn = document.getElementById("menuBtn");
const modalPlayerSelect = document.getElementById("playerAndDeckSelect"); //player and deck select on modal

const turnTracker = document.getElementById("turnTracker");
const turnTrackerCountDisplay = document.getElementById("turnCountDisplay");
let players = [];
let savedPlayers = ["maynard", "leonard", "bernard", "richard"];
let currentPlayerIndex = null; // for deck select drop down
let startedGame = false;
let currentView = -1;
let turnCountVal = 0;

//FUNCTIONS
function initPlayers(count) {
    startedGame = true;
    players = [];

    for (let i = 0; i < count; i++) {
        players.push({
            name: `Player ${i + 1}`,
            life: 40,
            cmdDMG: [0, 0, 0, 0]
        });
    }

    renderPlayers();
}
function populateDropdown(playerIndex) {
    currentPlayerIndex = playerIndex;
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
    const grid = document.getElementById("playerGrid");
    grid.innerHTML = "";

    players.forEach((player, index) => {
        const div = document.createElement("div");
        div.className = "quadrant";
        div.dataset.index = index;

        div.innerHTML = `
            <div class="playerName">${player.name}</div>

            <div class="lifeRow">
                <button class="lifeBtn minus">-</button>
                <div class="lifeTotal">${player.life}</div>
                <button class="lifeBtn plus">+</button>
            </div>
        `;

        grid.appendChild(div);
    });
}

function showModal(screen) {
    modal.style.display = "block";

    document.querySelectorAll(".menu-modal").forEach(el => {
        el.style.display = "none";
    });
    
    if (startedGame) {
        document.getElementById("endGameSave").style.display = "block";
    }
    document.getElementById(screen).style.display = "block";
    
}

function renderCommanderDamage() {
        
    const grid = document.getElementById("playerGrid");
    grid.innerHTML = "";
    
    players.forEach((player, i) => {

        const quadrant = document.createElement("div");
        quadrant.className = "quadrant";
        quadrant.dataset.index = i;

        

        // CENTER DISPLAY
        const center = document.createElement("div");
        center.className = "life";
        if (i == currentView) {

            const nameDiv = document.createElement("div");
            nameDiv.className = "cmdrDMG";
            nameDiv.dataset.index = i;

            const dmgDiv = document.createElement("div");
            dmgDiv.className = "cmd-life";
            dmgDiv.dataset.index = i;
            dmgDiv.textContent = "ATK4CMD"; //shows how much damage selected player hs done to each player(i)

            center.appendChild(nameDiv);
            center.appendChild(dmgDiv);
            quadrant.append(center);

        }else{
            
            const nameDiv = document.createElement("div");
            nameDiv.className = "cmdrDMG";
            nameDiv.dataset.index = i;

            const dmgDiv = document.createElement("div");
            dmgDiv.className = "cmd-life";
            dmgDiv.dataset.index = i;
            dmgDiv.textContent = players[i].cmdDMG[currentView]; //shows how much damage selected player hs done to each player(i)

            center.appendChild(nameDiv);
            center.appendChild(dmgDiv);

            // PLUS
            const plus = document.createElement("div");
            plus.className = "zone plus";
            plus.dataset.index = i;
            plus.dataset.change = 1;
            plus.textContent = "+";
            // MINUS
            const minus = document.createElement("div");
            minus.className = "zone minus";
            minus.dataset.index = i;
            minus.dataset.change = -1;
            minus.textContent = "-";
            quadrant.append(plus, center, minus);
        } 
        

        
        grid.appendChild(quadrant);
    });
}

//#####***EVENT_LISTENERS***#####

// ***LIFE BTN*** CLICK EVENT LISTENER 
document.addEventListener("click", (e) => {
    if (!e.target.classList.contains("lifeBtn")) return;

    const index = e.target.closest(".quadrant").dataset.index;

    if (e.target.classList.contains("plus")) {
        players[index].life++;
    }

    if (e.target.classList.contains("minus")) {
        players[index].life--;
    }

    renderPlayers();
});
// *** ***

// ***MENU BTN*** CLICK EVENT LISTENER

menuBtn.addEventListener("click", () => {
    console.log("menu click");
    showModal("playerCount");
});

closeMenuBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalPlayerCountSelect.style.display = "none";

});

// Close if user clicks outside modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        modalPlayerCountSelect.style.display = "none";
    }
});

//player count listener

document.getElementById("numPlayer2").onclick = () => initPlayers(2);
document.getElementById("numPlayer3").onclick = () => initPlayers(3);
document.getElementById("numPlayer4").onclick = () => initPlayers(4);

// *** ***

// ***PLAYER/DECK SELECT DROP DOWN*** LISTENER

document.getElementById("gameContainer").addEventListener("click", (e) => {
    const quadrant = e.target.closest(".quadrant");
    if (!quadrant) return; // clicked outside a player

    const index = quadrant.dataset.index;

    console.log(index);

    if (e.target.classList.contains("playerName")) {
        console.log("testchangeplayer");
        console.log("e.target " + index);
        populateDropdown(index);
        modal.style.display = "block";
        modalPlayerSelect.style.display = "block";
    }

});

document.getElementById("playerSelect").addEventListener("change", (e) => {

    var newName = e.target.value;

    if (newName === "__custom__") {
        const name = prompt("Enter a new player name:");
        if (name && name.trim() !== "") {
            newName = name.trim();
        } else {
            newName = "-----";
        }
        // Save it
        if (!savedPlayers.includes(newName) && newName != "-----") {
            savedPlayers.push(newName);
        }
    }

    if (currentPlayerIndex !== null) {
        console.log(newName);
        console.log(currentPlayerIndex);
        console.log(players[currentPlayerIndex]);
        players[currentPlayerIndex].name = newName;
        renderPlayers();
        modal.style.display = "none";
        modalPlayerCountSelect.style.display = "none";
        modalPlayerSelect.style.display = "none";
    }

    //modalPlayerSelect.style.display = "none";
});

// *** ***

// *** COMMANDER DMG LISTENER ***

document.getElementById("playerGrid").addEventListener("click", (e) => {

    //ZONE (+ / - buttons)
    const zone = e.target.closest(".zone");
    if (zone) {
        const index = Number(zone.dataset.index);
        const change = Number(zone.dataset.change);
        if (currentView < 0) {
            players[index].life += change;
            renderPlayers();
        } else {
            if (players[index].cmdDMG[currentView]+(change)<0) {
                return;
            }else{
                players[index].life += change*(-1);
                
                players[index].cmdDMG[currentView] += change;
            }
            renderCommanderDamage();
        }

        return;
    }

    //LIFE CLICK (toggle commander view)
    const life = e.target.closest(".quadrant", ".lifeTotal");
    if (life) {
        const index = Number(life.dataset.index);
        console.log(life.dataset.index);
        console.log(Number(life.dataset.index));
        if (currentView < 0) {
            currentView = index;
            console.log(currentView);
            console.log("preCMD");
            renderCommanderDamage(index);
        } else {
            currentView = -1;
            console.log("postCMD");
            renderPlayers();
        }

        return;
    }

});

//*** ***

//*** TURN TRACKER LISTENER ***

turnTracker.addEventListener("click", (e) => {

    if (e.target.closest("#turnPlus")) {
        turnCountVal += 1;
        turnTrackerCountDisplay.textContent = turnCountVal;
    }

    if (e.target.closest("#turnMinus")) {
        turnCountVal -= 1;

        if (turnCountVal < 0) {
            turnCountVal = 0;
        }
        turnTrackerCountDisplay.textContent = turnCountVal;
    }

});

//*** ***

//END