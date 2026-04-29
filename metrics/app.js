
let gameData = [];
let players = [];
const loadBtn = document.getElementById("loadData");
const loadFileInput = document.getElementById("fileInput");
const playerSelectDropBtn = document.getElementById("playerSelect");

function playerSelectDropDown() {
    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player;
        option.textContent = player;
        playerSelectDropBtn.appendChild(option);
    });
}
function loadGameData(data) {
    // plug into your existing player / grid system
    gameData = data;

    gameData.forEach(g => {
        players.push(g.winner);
    })

    playerSelectDropDown(); // add players to dropdown select after DATA has been loaded
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

})