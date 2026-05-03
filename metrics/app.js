
let gameData = [];
let players = [];
let playerHistoryObject = [];
const loadBtn = document.getElementById("loadData");
const loadFileInput = document.getElementById("fileInput");
const playerSelectDropBtn = document.getElementById("playerSelect");
const oppSelectDropBtn = document.getElementById("oppSelect");

function playerSelectDropDown() {
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player;
        //console.log(option.value);
        option.textContent = player;
        playerSelectDropBtn.appendChild(option);
    });
}
function oppSelectDropDown() {
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player;
        //console.log(option.value);
        option.textContent = player;
        oppSelectDropBtn.appendChild(option);
    });
}

function loadGameData(data) {
    // plug into your existing player / grid system
    gameData = data;

    gameData.forEach(g => {
        let tempHistoryObject = {
            name: "name", winCount: 0, gamesWon: [] };


        if (!playerHistoryObject.some(p => p.name === g.winner)) {
            players.push(g.winner);
            tempHistoryObject.name = g.winner;
            tempHistoryObject.winCount += 1;
            tempHistoryObject.gamesWon.push(g);

            playerHistoryObject.push(tempHistoryObject); // add new player object
        } else {

            const player = playerHistoryObject.find(p => p.name === g.winner);

            player.winCount += 1;
            player.gamesWon.push(g);
        }
    })

    playerSelectDropDown(); // add players to dropdown select after DATA has been loaded
    oppSelectDropDown();
}



//load from saved file
loadBtn.addEventListener("click", () => {
    console.log("load clicked");

    document.getElementById("fileInput").click();
})

loadFileInput.addEventListener("change", (e) => {
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

// select player stats to view

playerSelectDropBtn.addEventListener("change", (e)=>{
    var select = e.target.value;
    const player = playerHistoryObject.find(p => p.name === select);
    const cardDisplay = document.getElementById("games-list");

    cardDisplay.innerHTML = "";

    document.getElementById("playerCardName").innerText = select;
    document.getElementById("playerCardWinCount").innerText = "games won: "+player.gamesWon.length;

    player.gamesWon.forEach((game, index) => {
        const div = document.createElement("div");
        div.className = "game-row";
        div.dataset.index = index;

        div.innerText = "won on turn: " + game.turnCount + " table: " + JSON.stringify(game.players) + " date: " + game.date;

        cardDisplay.appendChild(div);
    });

})

oppSelectDropBtn.addEventListener("change", (e) => {
    var select = e.target.value;
    const opp = playerHistoryObject.find(o => o.name === select);


})