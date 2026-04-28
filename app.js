// DECLARED VARIABLES:

const modal = document.getElementById("modal"); //modal menu
const closeMenuBtn = document.getElementById("closeModalBtn");
const modalPlayerCountSelect = document.getElementById("playerCount"); //player count select modal
const menuBtn = document.getElementById("menuBtn");
const modalPlayerSelect = document.getElementById("playerAndDeckSelect"); //player and deck select on modal
const saveGameMenu = document.getElementById("endGameSave");

const turnTracker = document.getElementById("turnTracker");
const turnTrackerCountDisplay = document.getElementById("turnCountDisplay");

const Storage = {
    cache: {
        games: null,
        players: null
    },

    load() {
        this.cache.games = JSON.parse(localStorage.getItem("games") || "[]");
        this.cache.players = JSON.parse(localStorage.getItem("savedPlayers") || "[]");
    },

    getGames() {
        return this.cache.games;
    },

    setGames: (games) => {
        localStorage.setItem("games", JSON.stringify(games));
        Storage.cache.games = games;
    },

    addGame: (game) => {
        gameHistory = Storage.getGames();
        gameHistory.push(game);
        Storage.setGames(gameHistory);
    },

    getPlayers() {
        return this.cache.players;
    },

    setPlayers: (savedNames) => {
        localStorage.setItem("savedPlayers", JSON.stringify(savedNames));
        Storage.cache.players = savedNames; // keep cache in sync
    },

    addPlayers: (names) => {
        const saved = Storage.getPlayers();

        names.forEach(name => {
            if (!saved.includes(name)) {
                saved.push(name);
            }
        });

        Storage.setPlayers(saved);
    }
};

let players = [];
let savedPlayers = ["maynard", "leonard", "bernard", "richard"];
let currentPlayerIndex = null; // for deck select drop down
let startedGame = false;
let currentView = -1;
let turnCountVal = 0;

let gameHistory = [];

//FUNCTIONS
function initPlayers(count) {
    startedGame = true;
    players = [];
    turnCountVal = 0;
    turnTrackerCountDisplay.textContent = turnCountVal;

    Storage.load();
    gameHistory = Storage.getGames();
    savedPlayers = Storage.getPlayers();
    console.log("saved players: "+ savedPlayers);
    for (let i = 0; i < count; i++) {
        players.push({
            name: `Player ${i + 1}`,
            life: 40,
            cmdDMG: [0, 0, 0, 0],
            twoCommanders: false
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
            <div class="playerName">
                <button class="playerNameButton">${player.name}</button>
            </div>

            <div class="lifeRow">
                <button class="lifeBtn minus">-</button>
                <div class="lifeTotal">${player.life}</div>
                <button class="lifeBtn plus">+</button>
            </div>
        `;

        grid.appendChild(div);
    });
}

function showModal(...args) {
    modal.style.display = "block";

    document.querySelectorAll(".menu-modal").forEach(el => {
        el.style.display = "none";
    });
    
    args.forEach(arg => {
        document.getElementById(arg).style.display = "block";

    })
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

            const twoCmdBtn = document.createElement("button");
            twoCmdBtn.className = "commanderToggle";
            twoCmdBtn.textContent = players[i].twoCommanders
                ? "2 Commanders: ON"
                : "2 Commanders: OFF";
            twoCmdBtn.dataset.index = i;

            center.appendChild(nameDiv);
            center.appendChild(dmgDiv);
            center.appendChild(twoCmdBtn);
            quadrant.append(center);

        } else {
            //rework 
            if (players[currentView].twoCommanders===true) {
                for (let cmd = 0; cmd < 2; cmd++) {

                    const row = document.createElement("div");
                    row.className = "cmd-row";

                    const nameDiv = document.createElement("div");
                    nameDiv.className = "cmdrDMG";
                    nameDiv.dataset.index = i;

                    const dmgDiv = document.createElement("div");
                    dmgDiv.className = "cmd-life";
                    dmgDiv.dataset.index = i;
                    dmgDiv.dataset.cmd = cmd; // record which commander
                    dmgDiv.textContent = players[i].cmdDMG[currentView]?.[cmd] ?? 0;

                    // PLUS
                    const plus = document.createElement("div");
                    plus.className = "zone plus";
                    plus.dataset.index = i;
                    plus.dataset.cmd = cmd;
                    plus.dataset.change = 1;
                    plus.textContent = "+";

                    const plusBtn = document.createElement("button");
                    plusBtn.className = "plus CMD";
                    plusBtn.dataset.index = i;
                    plusBtn.dataset.cmd = cmd;
                    plusBtn.dataset.change = 1;
                    plusBtn.textContent = "+";

                    plus.appendChild(plusBtn);
                    // MINUS
                    const minus = document.createElement("div");
                    minus.className = "zone minus";
                    minus.dataset.index = i;
                    minus.dataset.cmd = cmd;
                    minus.dataset.change = -1;
                    minus.textContent = "-";

                    const minusBtn = document.createElement("button");
                    minusBtn.className = "minus CMD";
                    minusBtn.dataset.index = i;
                    minusBtn.dataset.cmd = cmd;
                    minusBtn.dataset.change = -1;
                    minusBtn.textContent = "-";
                    minus.appendChild(minusBtn);

                    row.append(plus, nameDiv, dmgDiv, minus);

                    // Add to center
                    center.appendChild(row);

                    // Add center once per quadrant (not inside loop ideally)
                    quadrant.appendChild(center);
                }
            } else {
                const nameDiv = document.createElement("div");
                nameDiv.className = "cmdrDMG";
                nameDiv.dataset.index = i;

                const dmgDiv = document.createElement("div");
                dmgDiv.className = "cmd-life";
                dmgDiv.dataset.index = i;
                dmgDiv.dataset.cmd = 0; // record which commander
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
        } 
        grid.appendChild(quadrant);
    });
}

function winnerDropDown() {
    const select = document.getElementById("winnerSelect");
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.textContent = "Who won?";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player.name;
        option.textContent = player.name;
        select.appendChild(option);
    });
}

function downloadJSON(data, filename = "MTGgameTRACKERdata.json") {

    const jsonString = JSON.stringify(data, null, 2); // pretty print
    const blob = new Blob([jsonString], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function loadGameData(data) {
    // plug into your existing player / grid system
    gameHistory = data;
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
    showModal("playerCount");
    if (startedGame) {
        document.getElementById("finalTurnCount").innerText = turnCountVal;
        showModal("playerCount", "endGameSave");
        winnerDropDown();
        
    }
});

closeMenuBtn.addEventListener("click", () => {

    modal.style.display = "none";
    modalPlayerCountSelect.style.display = "none";
    modalPlayerSelect.style.display = "none";
    saveGameMenu.style.display = "none";
});

// Close if user clicks outside modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
        modalPlayerCountSelect.style.display = "none";
        modalPlayerSelect.style.display = "none";
        saveGameMenu.style.display = "none";

    }
});

//player count listener

document.getElementById("numPlayer2").onclick = () => initPlayers(2);
document.getElementById("numPlayer3").onclick = () => initPlayers(3);
document.getElementById("numPlayer4").onclick = () => initPlayers(4);

// *** ***

// ***PLAYER/DECK SELECT DROP DOWN*** LISTENER

document.getElementById("gameContainer").addEventListener("click", (e) => {
    console.log("button player select");
    const quadrant = e.target.closest(".quadrant");
    if (!quadrant) return; // clicked outside a player

    const index = quadrant.dataset.index;

    if (e.target.classList.contains("playerNameButton")) {
        populateDropdown(index);
        showModal("playerAndDeckSelect")
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
        players[currentPlayerIndex].name = newName;
        renderPlayers();
        modal.style.display = "none";
        modalPlayerCountSelect.style.display = "none";
        modalPlayerSelect.style.display = "none";
    }
    //modalPlayerSelect.style.display = "none";
});

// *** ***

// *** winner select drop down***

document.getElementById("winnerSelect").addEventListener("change", (e) => {
    const selectedWinner = e.target.value;
    console.log("Winner:", selectedWinner);
});

// *** ***

// *** SAVE BUTTON LISTENER ***
document.getElementById("submitGameBtn").addEventListener("click", () => {
    const winner = document.getElementById("winnerSelect").value;

    const gameData = {
        players: players.map(p => p.name),
        winner: winner,
        turnCount: document.getElementById("finalTurnCount").textContent,
        date: new Date().toISOString()
    };

    Storage.addGame(gameData);

    let tempSavedPlayers = [];
    players.forEach(p=>{
        if (!Storage.getPlayers().includes(p.name)) {
            tempSavedPlayers.push(p.name);
        }
    })

    if (tempSavedPlayers.length > 0) {
        console.log(tempSavedPlayers);
        Storage.addPlayers(tempSavedPlayers);

    }
});
// *** ***

//*** DOWNLOAD FILE LISTENER***

document.getElementById("downloadSaves").addEventListener("click", () => {
    downloadJSON(gameHistory);
    
})

//*** ***


//*** LOAD JSON FILE ***

document.getElementById("loadSaves").addEventListener("click", () => {
    console.log("load clicked");

    document.getElementById("fileInput").click();
})

document.getElementById("fileInput").addEventListener("change", (e) => {
    console.log("running input load");
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            console.log("Loaded JSON:", data);

            // call your function to populate UI here
            loadGameData(data);
            alert("loaded file");

        } catch (err) {
            alert("Invalid JSON file");
            console.error("Invalid JSON file", err);
        }
    };

    reader.readAsText(file);
});

//*** ***
// *** COMMANDER DMG LISTENER ***

document.getElementById("playerGrid").addEventListener("click", (e) => {

    //ZONE (+ / - buttons)
    const zone = e.target.closest(".CMD");
    if (zone) {
        const change = Number(zone.dataset.change);
        const cmd = Number(zone.dataset.cmd);
        const index = Number(zone.dataset.index);

        if (currentView < 0) {
            players[index].life += change;
            renderPlayers();
        } else {
            let value = players[index].cmdDMG[currentView];

            if (Array.isArray(value)) {
                // two commanders
                if (value[cmd] + change < 0) return;

                value[cmd] += change;
            } else {
                // single commander
                if (value + change < 0) return;

                players[index].cmdDMG[currentView] += change;
            }
            // life adjustment (this part you had correct idea-wise)
            players[index].life -= change;
            renderCommanderDamage(currentView);
        }
        return;
    }

    // TOGGLE MULTI COMMANDER
    const toggle = e.target.closest(".commanderToggle");

    if (toggle) {
        const index = Number(toggle.dataset.index);
        players[index].twoCommanders = !players[index].twoCommanders;
        //update cmdDMG to have two commanders

        if (players[index].twoCommanders === true) {

            for (let p = 0; p < players.length; p++) {

                let value = players[p].cmdDMG[index];
                // if it's NOT already an array convert it
                if (!Array.isArray(value)) {
                    players[p].cmdDMG[index] = [value, 0];
                }
            }
        } else {
            for (let p = 0; p < players.length; p++) {

                let value = players[p].cmdDMG[index];
                // if it's an array collapse it
                if (Array.isArray(value)) {
                    players[p].cmdDMG[index] = value[0];
                }
            }
        }
        toggle.textContent = players[index].twoCommanders
            ? "2 Commanders: ON"
            : "2 Commanders: OFF";

        renderCommanderDamage();
        return;
    }

    //LIFE CLICK (toggle commander view)
    const life = e.target.closest(".quadrant", ".lifeTotal");

    if (life) {
        const index = Number(life.dataset.index);
        if (currentView < 0) {
            currentView = index;
            renderCommanderDamage(index);
        } else {
            currentView = -1;
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