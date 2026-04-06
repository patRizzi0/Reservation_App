document.addEventListener("DOMContentLoaded", () => {
    console.log("salon.js caricato");
    console.log("window.seatsData:", window.seatsData);

    const sectionContainers = {
        A: document.getElementById("section-A"),
        B: document.getElementById("section-B"),
        C: document.getElementById("section-C")
    };

    console.log("sectionContainers:", sectionContainers);

    const selectedSeats = [];

    function groupSeatsBySectionAndRow(seats) {
        const grouped = {};

        seats.forEach(seat => {
            const section = seat.section;
            const row = seat.row_number;

            if (!grouped[section]) {
                grouped[section] = {};
            }

            if (!grouped[section][row]) {
                grouped[section][row] = [];
            }

            grouped[section][row].push(seat);
        });

        return grouped;
    }

    function createSeatButton(seat) {
        const button = document.createElement("button");
        button.classList.add("seat");
        button.textContent = seat.seat_number;

        button.dataset.idSeat = seat.id_seat;
        button.dataset.section = seat.section;
        button.dataset.row = seat.row_number;
        button.dataset.number = seat.seat_number;
        button.dataset.type = seat.seat_type;
        button.dataset.status = seat.status;

        button.title = `Settore ${seat.section} - Fila ${seat.row_number} - Posto ${seat.seat_number}`;

        if (seat.seat_type === "vip") {
            button.classList.add("seat-vip");
        } else if (seat.seat_type === "premium") {
            button.classList.add("seat-premium");
        } else if (seat.seat_type === "disabili") {
            button.classList.add("seat-disabili");
        } else {
            button.classList.add("seat-standard");
        }

        if (seat.status === "occupato") {
            button.classList.add("occupied");
            button.disabled = true;
        } else {
            button.classList.add("available");

            button.addEventListener("click", () => {
                button.classList.toggle("selected");

                const seatId = Number(button.dataset.idSeat);
                const alreadySelected = selectedSeats.includes(seatId);

                if (alreadySelected) {
                    const index = selectedSeats.indexOf(seatId);
                    selectedSeats.splice(index, 1);
                } else {
                    selectedSeats.push(seatId);
                }

                console.log("Posti selezionati:", selectedSeats);
            });
        }

        return button;
    }

    function renderSeats(seats) {
        console.log("renderSeats chiamata con:", seats);

        const groupedSeats = groupSeatsBySectionAndRow(seats);
        console.log("groupedSeats:", groupedSeats);

        for (const section in groupedSeats) {
            const sectionContainer = sectionContainers[section];
            console.log("section:", section, "container:", sectionContainer);

            if (!sectionContainer) continue;

            sectionContainer.innerHTML = `<h3 class="section-title">Settore ${section}</h3>`;

            const rows = groupedSeats[section];

            for (const rowNumber in rows) {
                const rowDiv = document.createElement("div");
                rowDiv.classList.add("seat-row");

                const rowLabel = document.createElement("span");
                rowLabel.classList.add("row-label");
                rowLabel.textContent = `Fila ${rowNumber}`;
                rowDiv.appendChild(rowLabel);

                rows[rowNumber].forEach(seat => {
                    const button = createSeatButton(seat);
                    rowDiv.appendChild(button);
                });

                sectionContainer.appendChild(rowDiv);
            }
        }
    }

    console.log("JS seats:", window.seatsData);

    if (Array.isArray(window.seatsData) && window.seatsData.length > 0) {
        renderSeats(window.seatsData);
    } else {
        console.log("Nessun posto trovato oppure seatsData non valido");
    }
});