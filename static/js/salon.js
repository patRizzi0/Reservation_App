/**
 * State Management Centralizzato
 */
const AppState = {
    selectedSeatId: null,
    isCardOpen: false,
    seats: [],
    eventId: null,

    selectSeat(seatId) {
        this.selectedSeatId = seatId;
        this.isCardOpen = true;
    },

    deselectSeat() {
        this.selectedSeatId = null;
        this.isCardOpen = false;
    },

    getSelectedSeat() {
        if (this.selectedSeatId === null) return null;
        return this.seats.find(seat => seat.id_seat === this.selectedSeatId) || null;
    },

    setSeatsList(seats) {
        this.seats = seats;
    },

    setEventId(id) {
        this.eventId = id;
    }
};

/**
 * DOM Helpers
 */
const DOM = {
    sectionA: null,
    sectionB: null,
    sectionC: null,
    seatDetailCard: null,
    seatDetails: null,
    seatPreviewNumber: null,
    detailSection: null,
    detailRow: null,
    detailNumber: null,
    detailType: null,
    detailStatus: null,
    detailPrice: null,
    closeCardBtn: null,
    confirmSeatBtn: null,
    emptyCardMessage: null,

    init() {
        this.sectionA = document.getElementById("section-A");
        this.sectionB = document.getElementById("section-B");
        this.sectionC = document.getElementById("section-C");
        this.seatDetailCard = document.getElementById("seat-detail-card");
        this.seatDetails = document.getElementById("seat-details");
        this.seatPreviewNumber = document.getElementById("seat-preview-number");
        this.detailSection = document.getElementById("detail-section");
        this.detailRow = document.getElementById("detail-row");
        this.detailNumber = document.getElementById("detail-number");
        this.detailType = document.getElementById("detail-type");
        this.detailStatus = document.getElementById("detail-status");
        this.detailPrice = document.getElementById("detail-price");
        this.closeCardBtn = document.getElementById("close-card");
        this.confirmSeatBtn = document.getElementById("confirm-seat-btn");
        this.emptyCardMessage = document.getElementById("empty-card-message");
    },

    getSectionContainer(sectionName) {
        const sections = { A: this.sectionA, B: this.sectionB, C: this.sectionC };
        return sections[sectionName] || null;
    },

    updateCardContent(seat) {
        this.seatPreviewNumber.textContent = seat.seat_number ?? "--";
        this.detailSection.textContent = seat.section ?? "--";
        this.detailRow.textContent = seat.row_number ?? "--";
        this.detailNumber.textContent = seat.seat_number ?? "--";
        this.detailType.textContent = this.formatSeatType(seat.seat_type);
        this.detailStatus.textContent = this.formatSeatStatus(seat.status);

        if (this.detailPrice) {
            const price = seat.price !== undefined && seat.price !== null
                ? Number(seat.price).toFixed(2)
                : "--";
            this.detailPrice.textContent = price !== "--" ? `€ ${price}` : price;
        }

        if (this.emptyCardMessage) {
            this.emptyCardMessage.classList.add("hidden");
        }

        if (this.seatDetails) {
            this.seatDetails.classList.remove("hidden");
        }

        if (this.confirmSeatBtn) {
            this.confirmSeatBtn.disabled = seat.status === "occupato";
        }
    },

    resetCardContent() {
        this.seatPreviewNumber.textContent = "--";
        this.detailSection.textContent = "--";
        this.detailRow.textContent = "--";
        this.detailNumber.textContent = "--";
        this.detailType.textContent = "--";
        this.detailStatus.textContent = "--";
        this.detailPrice.textContent = "--";

        if (this.emptyCardMessage) {
            this.emptyCardMessage.classList.remove("hidden");
        }

        if (this.seatDetails) {
            this.seatDetails.classList.add("hidden");
        }

        if (this.confirmSeatBtn) {
            this.confirmSeatBtn.disabled = true;
            this.confirmSeatBtn.textContent = "Conferma selezione";
        }
    },

    showCard() {
        this.seatDetailCard.classList.remove("hidden");
        this.seatDetailCard.setAttribute("aria-hidden", "false");
    },

    hideCard() {
        this.seatDetailCard.classList.add("hidden");
        this.seatDetailCard.setAttribute("aria-hidden", "true");
    },

    clearSelection() {
        document.querySelectorAll(".seat.selected").forEach(btn => {
            btn.classList.remove("selected");
        });
    },

    formatSeatType(type) {
        const types = { standard: "Standard", premium: "Premium", vip: "VIP", disabili: "Disabili" };
        return types[type] || type || "--";
    },

    formatSeatStatus(status) {
        const statuses = { disponibile: "Disponibile", occupato: "Occupato" };
        return statuses[status] || status || "--";
    }
};

function handleSeatClick(button, seat) {
    if (seat.status === "occupato") return;

    if (AppState.selectedSeatId === seat.id_seat) {
        resetSeatSelection();
        return;
    }

    AppState.selectSeat(seat.id_seat);
    DOM.clearSelection();
    button.classList.add("selected");
    DOM.updateCardContent(seat);
    DOM.showCard();
}

function resetSeatSelection() {
    AppState.deselectSeat();
    DOM.clearSelection();
    DOM.resetCardContent();
    DOM.hideCard();
}

function createSeatButton(seat) {
    const button = document.createElement("button");
    button.classList.add("seat");
    button.type = "button";
    button.textContent = seat.seat_number;

    button.dataset.idSeat = seat.id_seat;
    button.dataset.section = seat.section;
    button.dataset.row = seat.row_number;
    button.dataset.number = seat.seat_number;
    button.dataset.type = seat.seat_type;
    button.dataset.status = seat.status;

    const seatTypeLabel = DOM.formatSeatType(seat.seat_type);
    button.setAttribute("aria-label",
        `${seatTypeLabel} - Settore ${seat.section}, Fila ${seat.row_number}, Posto ${seat.seat_number}`
    );

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
        button.setAttribute("aria-disabled", "true");
    } else {
        button.classList.add("available");
        button.addEventListener("click", () => handleSeatClick(button, seat));
    }

    return button;
}

function createRowLabel(rowNumber) {
    const span = document.createElement("span");
    span.classList.add("row-label");
    span.textContent = `Fila ${rowNumber}`;
    span.setAttribute("aria-label", `Fila numero ${rowNumber}`);
    return span;
}

function groupSeatsBySectionAndRow(seats) {
    const grouped = {};
    seats.forEach(seat => {
        const section = seat.section;
        const row = seat.row_number;
        if (!grouped[section]) grouped[section] = {};
        if (!grouped[section][row]) grouped[section][row] = [];
        grouped[section][row].push(seat);
    });
    return grouped;
}

function renderSeats(seats) {
    const groupedSeats = groupSeatsBySectionAndRow(seats);

    for (const section in groupedSeats) {
        const sectionContainer = DOM.getSectionContainer(section);
        if (!sectionContainer) continue;

        sectionContainer.innerHTML = "";

        const titleElement = document.createElement("h3");
        titleElement.classList.add("section-title");
        titleElement.textContent = `Settore ${section}`;
        sectionContainer.appendChild(titleElement);

        const rows = groupedSeats[section];
        const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

        sortedRows.forEach(rowNumber => {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("seat-row");
            rowDiv.setAttribute("role", "row");

            const rowLabel = createRowLabel(rowNumber);
            rowDiv.appendChild(rowLabel);

            rows[rowNumber].forEach(seat => {
                const button = createSeatButton(seat);
                rowDiv.appendChild(button);
            });

            sectionContainer.appendChild(rowDiv);
        });
    }
}

function setupEventListeners() {
    if (DOM.closeCardBtn) {
        DOM.closeCardBtn.addEventListener("click", resetSeatSelection);
    }

    if (DOM.confirmSeatBtn) {
        DOM.confirmSeatBtn.addEventListener("click", () => {
            if (AppState.selectedSeatId === null) {
                alert("Seleziona un posto prima di confermare");
                return;
            }

            if (!AppState.eventId) {
                alert("Errore: evento non trovato");
                return;
            }

            const selectedSeat = AppState.getSelectedSeat();
            if (!selectedSeat) {
                alert("Errore: posto non trovato");
                return;
            }

            DOM.confirmSeatBtn.disabled = true;
            DOM.confirmSeatBtn.textContent = "Sto confermando...";

            fetch("/api/reserve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_evento: AppState.eventId,
                    seat_id: AppState.selectedSeatId,
                    section: selectedSeat.section,
                    row: selectedSeat.row_number,
                    seat_number: selectedSeat.seat_number
                })
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert("Prenotazione confermata!");
                        resetSeatSelection();
                        location.reload();
                    } else {
                        alert("Errore: " + (data.message || "Sconosciuto"));
                    }
                })
                .catch(error => {
                    console.error("Errore:", error);
                    alert("Errore di connessione. Riprova.");
                })
                .finally(() => {
                    if (DOM.confirmSeatBtn) {
                        DOM.confirmSeatBtn.disabled = AppState.selectedSeatId === null;
                        DOM.confirmSeatBtn.textContent = "Conferma selezione";
                    }
                });
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && AppState.isCardOpen) {
            resetSeatSelection();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    DOM.init();
    DOM.resetCardContent();
    DOM.hideCard();

    if (window.eventData && window.eventData.id_evento) {
        AppState.setEventId(window.eventData.id_evento);
    } else {
        console.error("Errore: evento non disponibile");
    }

    if (Array.isArray(window.seatsData) && window.seatsData.length > 0) {
        AppState.setSeatsList(window.seatsData);
        renderSeats(window.seatsData);
    } else {
        console.warn("Nessun dato di posti disponibile");
    }

    setupEventListeners();
    console.log("Initialized - Event ID:", AppState.eventId, "Seats:", AppState.seats.length);
});

