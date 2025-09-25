console.log("XLSX loaded?", typeof XLSX !== 'undefined');
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Elements shared by both pages
const tableBody = document.querySelector('#leaderboard-table tbody');
const winnerDisplay = document.getElementById('winner');
const form = document.getElementById('admin-form');
const message = document.getElementById('admin-message');
const clearBtn = document.getElementById('clear-storage-btn');

// Admin form handling
// Admin form handling
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const avgPowerRaw = document.getElementById('avgPower').value.trim();
        const wattsRaw = document.getElementById('watts').value.trim();
        const company = document.getElementById('company').value.trim();

        if (!/^[A-Za-z\s]+$/.test(name)) {
            message.textContent = 'Name must contain only letters and spaces.';
            message.style.color = 'red';
            return;
        }

        const avgPower = parseFloat(avgPowerRaw);
        if (isNaN(avgPower) || avgPower < 0) {
            message.textContent = 'Average power must be a positive number.';
            message.style.color = 'red';
            return;
        }

        const watts = parseInt(wattsRaw, 10);
        if (isNaN(watts) || watts < 0) {
            message.textContent = 'Watts must be a positive number.';
            message.style.color = 'red';
            return;
        }

        if (!/^[A-Za-z0-9\s]+$/.test(company)) {
            message.textContent = 'Company name can only contain letters, numbers, and spaces.';
            message.style.color = 'red';
            return;
        }

        leaderboard.push({ name, avgPower, watts, company });
        message.textContent = 'Entry added!';
        message.style.color = '#1a8f1a';

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        form.reset();

        window.dispatchEvent(new StorageEvent('storage', {
            key: 'leaderboard',
            newValue: JSON.stringify(leaderboard)
        }));
    });
}


    clearBtn?.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear the entire leaderboard?')) {
            localStorage.removeItem('leaderboard');
            leaderboard = [];
            message.textContent = 'Leaderboard cleared!';
            message.style.color = '#ff4f4f';

            window.dispatchEvent(new StorageEvent('storage', {
                key: 'leaderboard',
                newValue: JSON.stringify([])
            }));
        }
    });


// Leaderboard render logic (index page)
function renderLeaderboard() {
    if (!tableBody) return;
    tableBody.innerHTML = '';
    leaderboard.sort((a, b) => b.avgPower - a.avgPower);
    for (let i = 0; i < 10; i++) {
        const entry = leaderboard[i];
        const row = document.createElement('tr');
        let medal = '';
        if (i === 0) medal = '🥇 ';
        else if (i === 1) medal = '🥈 ';
        else if (i === 2) medal = '🥉 ';

        row.innerHTML = `
            <td>${medal}${i + 1}</td>
            <td>${entry ? entry.name : ''}</td>
            <td>${entry ? entry.avgPower + ' KM' : ''}</td>
            <td>${entry ? entry.watts + ' W' : ''}</td>
            <td>${entry ? entry.company : ''}</td>
        `;
        tableBody.appendChild(row);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const carousel = document.querySelector('.sponsor-carousel');

    if (!track || !carousel) return;

    const trackWidth = () => track.scrollWidth;
    const visibleWidth = () => carousel.offsetWidth;

    while (trackWidth() < visibleWidth() * 2) {
        Array.from(track.children).forEach(child => {
            track.appendChild(child.cloneNode(true));
        });
    }

    let scrollAmount = 0;
    const speed = 0.5;

    function animateScroll() {
        scrollAmount += speed;
        if (scrollAmount >= track.scrollWidth / 2) {
            scrollAmount = 0;
        }
        track.scrollLeft = scrollAmount;
        requestAnimationFrame(animateScroll);
    }

    requestAnimationFrame(animateScroll);
});

// Initial render
renderLeaderboard?.();

// Listener for storage updates
window.addEventListener('storage', (e) => {
    if (e.key === 'leaderboard') {
        leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        renderLeaderboard();
    }
});

// ===== Excel export from Admin Panel =====
window.addEventListener("load", function () {
    const downloadBtn = document.getElementById('download-excel');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', function () {
        if (typeof XLSX === 'undefined') {
            alert('Excel export library not loaded!');
            return;
        }

        const raw = JSON.parse(localStorage.getItem('leaderboard')) || [];
        raw.sort((a, b) => b.avgPower - a.avgPower);

        const worksheetData = raw.map((entry, idx) => ({
            Rank: idx + 1,
            Name: entry.name,
            Distance: (typeof entry.avgPower === 'number')
                ? entry.avgPower.toFixed(2) + ' KM'
                : entry.avgPower + ' KM',
            Watts: entry.watts + " W",
            Company: entry.company
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leaderboard');

        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `Leaderboard_${ts}.xlsx`;

        XLSX.writeFile(workbook, filename);
    });
});
