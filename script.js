document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementsByClassName('close')[0];
    const faenaForm = document.getElementById('faenaForm');
    const exportBtn = document.getElementById('exportBtn');
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    function generateCalendar(month, year) {
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        calendar.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            calendar.innerHTML += `<div class="day empty"></div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendar.innerHTML += `<div class="day" data-date="${year}-${month + 1}-${day}">${day}</div>`;
        }

        document.querySelectorAll('.day').forEach(day => {
            day.addEventListener('click', function() {
                const selectedDate = this.getAttribute('data-date');
                document.getElementById('fecha').value = selectedDate;
                modal.style.display = 'block';
            });
        });
    }

    closeModal.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    faenaForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const fecha = document.getElementById('fecha').value;
        const faena = document.getElementById('faena').value;
        const kilometros = document.getElementById('kilometros').value;
        const horas = document.getElementById('horas').value;

        const trabajos = JSON.parse(localStorage.getItem('trabajos')) || {};
        if (!trabajos[fecha]) {
            trabajos[fecha] = [];
        }

        trabajos[fecha].push({ faena, kilometros, horas });
        localStorage.setItem('trabajos', JSON.stringify(trabajos));

        modal.style.display = 'none';
        renderCalendar();
    });

    function renderCalendar() {
        const trabajos = JSON.parse(localStorage.getItem('trabajos')) || {};

        document.querySelectorAll('.day').forEach(day => {
            const date = day.getAttribute('data-date');
            day.innerHTML = `<div>${new Date(date).getDate()}</div>`;
            if (trabajos[date]) {
                trabajos[date].forEach(trabajo => {
                    day.innerHTML += `<div>${trabajo.faena} - ${trabajo.kilometros} km - ${trabajo.horas} hrs</div>`;
                });
            }
        });
    }

    exportBtn.addEventListener('click', function() {
        const trabajos = JSON.parse(localStorage.getItem('trabajos')) || {};
        const rows = [['Fecha', 'Faena', 'Kilómetros', 'Horas']];

        for (const fecha in trabajos) {
            trabajos[fecha].forEach(trabajo => {
                rows.push([fecha, trabajo.faena, trabajo.kilometros, trabajo.horas]);
            });
        }

        let csvContent = "data:text/csv;charset=utf-8," 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "trabajos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    generateCalendar(currentMonth, currentYear);
    renderCalendar();
});
