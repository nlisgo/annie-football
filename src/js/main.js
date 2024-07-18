document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        "Football is a simple game; 22 men chase a ball for 90 minutes and at the end, the Germans always win. – Gary Lineker",
        "I learned all about life with a ball at my feet. – Ronaldinho",
        "The more difficult the victory, the greater the happiness in winning. – Pelé"
    ];

    // Display random quote if element with id "quote" exists
    const quoteElement = document.getElementById('quote');
    if (quoteElement) {
        quoteElement.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }

    const players = [];

    // Load players data
    fetchPlayersData();

    // Sort table
    window.sortTable = (n) => {
        const table = document.getElementById("players-table");
        let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount++;
            } else {
                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    };

    // Open modal
    window.openModal = (playerName) => {
        const player = players.find(p => p.name === playerName);
        const modal = document.getElementById("player-modal");
        document.getElementById("player-bio").innerHTML = `
            <h2>${player.name}</h2>
            <img src="/images/${player.image}" alt="${player.name}">
            <p>Supports: ${player.supports}</p>
            <p>${player.bio}</p>
            <p>Played: ${player.played}</p>
            <p>Goals: ${player.goals}</p>
            <p>Assists: ${player.assists}</p>
            <p>goals per game: ${player.goals / player.played}</p>
        `;
        modal.style.display = "block";
    };

    // Close modal
    document.querySelector(".close").onclick = () => {
        document.getElementById("player-modal").style.display = "none";
    };

    window.onclick = (event) => {
        const modal = document.getElementById("player-modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Calculate age
    function calculateAge(dob) {
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff);
        return Math.abs(age.getUTCFullYear() - 1970);
    }

    // Fetch players data
    async function fetchPlayersData() {
        try {
            const response = await fetch('players/players.json');
            const data = await response.json();
            const playerFiles = data.files;

            for (const file of playerFiles) {
                const response = await fetch(`players/${file}`);
                const player = await response.json();
                players.push(player);
            }

            // Display featured player
            if (document.getElementById('featured-player')) {
                const featuredPlayer = players[Math.floor(Math.random() * players.length)];
                document.getElementById('featured-player').innerHTML = `
                    <img src="/images/${featuredPlayer.image}" alt="${featuredPlayer.name}">
                    <h3>${featuredPlayer.name}</h3>
                    <p>${featuredPlayer.bio}</p>
                `;
            }

            // Populate players table
            if (document.getElementById('players-list')) {
                const playersList = document.getElementById('players-list');
                players.forEach(player => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="/images/${player.image}" alt="${player.name}" onclick="openModal('${player.name}')"></td>
                        <td>${player.name}</td>
                        <td>${calculateAge(player.dob)}</td>
                        <td>${player.played}</td>
                        <td>${player.goals}</td>
                        <td>${player.assists}</td>
                    `;
                    playersList.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error fetching players data:', error);
        }
    }
});
