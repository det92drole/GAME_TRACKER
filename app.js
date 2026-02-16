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
let players = JSON.parse(localStorage.getItem("players")) || ["Dan", "Alex", "Jordan"];
localStorage.setItem("players", JSON.stringify(players));

// Function to populate dropdown
function populateDropdown() {
    const select = document.getElementById("playerSelect");
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.textContent = "Select a player";
    placeholder.value = "";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    players.forEach(player => {
        const option = document.createElement("option");
        option.value = player;
        option.textContent = player;
        select.appendChild(option);
    });
}

// Populate on page load
populateDropdown();

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

            players = jsonData;
            localStorage.setItem("players", JSON.stringify(players));
            populateDropdown();
            alert("JSON loaded successfully!");
        } catch (err) {
            alert("Invalid JSON file!");
            console.error(err);
        }
    };
    reader.readAsText(file);
});