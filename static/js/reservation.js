const AppState = {
    currentView: "sectors",
    currentStep: 1,
    selectedSector: null,
    selectedSeatId: null,
    seats: [],
    eventId: null,
    userData: {
        nome: "",
        cognome: "",
        email: "",
        telefono: ""
    },

    setSeatsList(seats) {
        this.seats = seats;
    },

    setEventId(id) {
        this.eventId = id;
    },

    setView(viewName) {
        this.currentView = viewName;
    },

    setStep(stepNumber) {
        this.currentStep = stepNumber;
    },

    selectSector(sectorName) {
        this.selectedSector = sectorName;
        this.selectedSeatId = null;
        this.currentView = "seats";
    },

    clearSector() {
        this.selectedSector = null;
        this.selectedSeatId = null;
        this.currentView = "sectors";
    },

    selectSeat(seatId) {
        this.selectedSeatId = seatId;
    },

    deselectSeat() {
        this.selectedSeatId = null;
    },

    setUserData(data) {
        this.userData = { ...data };
    },

    getSelectedSeat() {
        if (this.selectedSeatId === null) return null;
        return this.seats.find(seat => seat.id_seat === this.selectedSeatId) || null;
    },

    getSeatsBySector(sectorName) {
        return this.seats.filter(seat => seat.section === sectorName);
    }
};

const DOM = {
    sectorView: null,
    seatView: null,
    sectorGrid: null,
    selectedSectorTitle: null,
    selectedSectorContainer: null,
    backToSectorsBtn: null,

    seatDetailCard: null,
    seatPreviewNumber: null,
    detailSection: null,
    detailRow: null,
    detailNumber: null,
    detailType: null,
    detailStatus: null,
    detailPrice: null,
    emptyCardMessage: null,
    confirmSeatBtn: null,

    step1: null,
    step2: null,
    step3: null,
    progressSteps: null,

    userDataForm: null,
    paymentForm: null,

    backToStep1Btn: null,
    goToStep3Btn: null,
    backToStep2Btn: null,

    nome: null,
    cognome: null,
    email: null,
    telefono: null,

    summarySector: null,
    summaryRow: null,
    summarySeat: null,
    summaryPrice: null,

    hiddenSeatId: null,
    hiddenSector: null,
    hiddenRow: null,
    hiddenNumber: null,
    hiddenPrice: null,

    hiddenNome: null,
    hiddenCognome: null,
    hiddenEmail: null,
    hiddenTelefono: null,

    init() {
        this.sectorView = document.getElementById("sector-view");
        this.seatView = document.getElementById("seatView");
        this.sectorGrid = document.getElementById("sector-grid");

        this.selectedSectorTitle = document.getElementById("selectedSectorTitle");
        this.selectedSectorContainer = document.getElementById("selectedSectorContainer");
        this.backToSectorsBtn = document.getElementById("backToSectorsBtn");

        this.seatDetailCard = document.getElementById("seatDetailCard");
        this.seatPreviewNumber = document.getElementById("seatPreviewNumber");

        this.detailSection = document.getElementById("detail-section");
        this.detailRow = document.getElementById("detail-row");
        this.detailNumber = document.getElementById("detail-number");
        this.detailType = document.getElementById("detail-type");
        this.detailStatus = document.getElementById("detail-status");
        this.detailPrice = document.getElementById("detail-price");

        this.emptyCardMessage = document.getElementById("emptyCardMessage");
        this.confirmSeatBtn = document.getElementById("confirm-seat-btn");

        this.step1 = document.getElementById("step-1");
        this.step2 = document.getElementById("step-2");
        this.step3 = document.getElementById("step-3");
        this.progressSteps = document.querySelectorAll(".progress-steps .step");

        this.userDataForm = document.getElementById("user-data-form");
        this.paymentForm = document.getElementById("payment-form");

        this.backToStep1Btn = document.getElementById("back-to-step-1");
        this.goToStep3Btn = document.getElementById("go-to-step-3");
        this.backToStep2Btn = document.getElementById("back-to-step-2");

        this.nome = document.getElementById("nome");
        this.cognome = document.getElementById("cognome");
        this.email = document.getElementById("email");
        this.telefono = document.getElementById("telefono");

        this.summarySector = document.getElementById("summary-sector");
        this.summaryRow = document.getElementById("summary-row");
        this.summarySeat = document.getElementById("summary-seat");
        this.summaryPrice = document.getElementById("summary-price");

        this.hiddenSeatId = document.getElementById("selected_seat_id");
        this.hiddenSector = document.getElementById("selected_sector");
        this.hiddenRow = document.getElementById("selected_row");
        this.hiddenNumber = document.getElementById("selected_number");
        this.hiddenPrice = document.getElementById("selected_price_hidden");

        this.hiddenNome = document.getElementById("nome_hidden");
        this.hiddenCognome = document.getElementById("cognome_hidden");
        this.hiddenEmail = document.getElementById("email_hidden");
        this.hiddenTelefono = document.getElementById("telefono_hidden");

        console.log("STEP 3 CHECK:", {
            userDataForm: this.userDataForm,
            paymentForm: this.paymentForm,
            backToStep1Btn: this.backToStep1Btn,
            goToStep3Btn: this.goToStep3Btn,
            backToStep2Btn: this.backToStep2Btn,
            summarySector: this.summarySector,
            summaryRow: this.summaryRow,
            summarySeat: this.summarySeat,
            summaryPrice: this.summaryPrice,
            hiddenSeatId: this.hiddenSeatId,
            hiddenSector: this.hiddenSector,
            hiddenRow: this.hiddenRow,
            hiddenNumber: this.hiddenNumber,
            hiddenPrice: this.hiddenPrice,
            hiddenNome: this.hiddenNome,
            hiddenCognome: this.hiddenCognome,
            hiddenEmail: this.hiddenEmail,
            hiddenTelefono: this.hiddenTelefono
        });
    },

    showSectorView() {
        this.sectorView.classList.remove("hidden");
        this.seatView.classList.add("hidden");
    },

    showSeatView() {
        this.sectorView.classList.add("hidden");
        this.seatView.classList.remove("hidden");
    },

    showStep(stepNumber) {
        const steps = [this.step1, this.step2, this.step3];

        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.remove("hidden");
                step.classList.add("active-step");
            } else {
                step.classList.add("hidden");
                step.classList.remove("active-step");
            }
        });

        this.progressSteps.forEach((stepEl, index) => {
            stepEl.classList.remove("active", "completed");

            if (index + 1 < stepNumber) {
                stepEl.classList.add("completed");
            } else if (index + 1 === stepNumber) {
                stepEl.classList.add("active");
            }
        });
    },

    clearSeatSelectionUI() {
        document.querySelectorAll(".seat.selected").forEach(seat => {
            seat.classList.remove("selected");
        });
    },

    resetSeatDetailCard() {
        if (!this.seatPreviewNumber) return;

        this.seatPreviewNumber.textContent = "--";
        this.detailSection.textContent = "--";
        this.detailRow.textContent = "--";
        this.detailNumber.textContent = "--";
        this.detailType.textContent = "--";
        this.detailStatus.textContent = "--";
        this.detailPrice.textContent = "--";
        this.emptyCardMessage.classList.remove("hidden");
        this.confirmSeatBtn.disabled = true;
        this.confirmSeatBtn.textContent = "Conferma selezione";
    },

    updateSeatDetailCard(seat) {
        this.seatPreviewNumber.textContent = seat.seat_number ?? "--";
        this.detailSection.textContent = seat.section ?? "--";
        this.detailRow.textContent = seat.row_number ?? "--";
        this.detailNumber.textContent = seat.seat_number ?? "--";
        this.detailType.textContent = formatSeatType(seat.seat_type);
        this.detailStatus.textContent = formatSeatStatus(seat.status);
        this.detailPrice.textContent = getSeatPrice(seat);
        this.emptyCardMessage.classList.add("hidden");
        this.confirmSeatBtn.disabled = seat.status !== "disponibile";
    }
};

function formatSeatType(type) {
    const map = {
        standard: "Standard",
        premium: "Premium",
        vip: "VIP",
        disabili: "Disabili"
    };

    return map[type] || type || "--";
}

function formatSeatStatus(status) {
    const map = {
        disponibile: "Disponibile",
        occupato: "Occupato"
    };

    return map[status] || status || "--";
}

function getSeatPrice(seat) {
    if (seat.price !== undefined && seat.price !== null) {
        return `€ ${Number(seat.price).toFixed(2)}`;
    }

    const fallbackPrices = {
        standard: 29.99,
        premium: 49.99,
        vip: 89.99,
        disabili: 19.99
    };

    const value = fallbackPrices[seat.seat_type];
    return value ? `€ ${value.toFixed(2)}` : "--";
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

function buildSectorStats(seats) {
    const stats = {};

    seats.forEach(seat => {
        const section = seat.section;

        if (!stats[section]) {
            stats[section] = {
                section,
                total: 0,
                available: 0
            };
        }

        stats[section].total += 1;

        if (seat.status === "disponibile") {
            stats[section].available += 1;
        }
    });

    return Object.values(stats);
}

function getSectorAvailabilityClass(available, total) {
    if (available === 0) return "sector-card--full";

    const percentage = (available / total) * 100;

    if (percentage < 10) return "sector-card--warning";

    return "sector-card--good";
}

function getSectorAvailabilityText(available, total) {
    if (available === 0) return "Completo";

    const percentage = (available / total) * 100;

    if (percentage < 10) return "Ultimi posti";

    return "Disponibile";
}

function renderSectorCards() {
    const sectorStats = buildSectorStats(AppState.seats);
    DOM.sectorGrid.innerHTML = "";

    sectorStats.forEach(sector => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = `sector-card ${getSectorAvailabilityClass(sector.available, sector.total)}`;

        card.innerHTML = `
            <div class="sector-card__top">
                <h3 class="sector-card__title">Settore ${sector.section}</h3>
                <span class="sector-card__badge">${getSectorAvailabilityText(sector.available, sector.total)}</span>
            </div>

            <div class="sector-card__stats">
                <p><strong>Posti totali:</strong> ${sector.total}</p>
                <p><strong>Disponibili:</strong> ${sector.available}</p>
            </div>
        `;

        if (sector.available === 0) {
            card.disabled = true;
        } else {
            card.addEventListener("click", () => {
                openSectorSeats(sector.section);
            });
        }

        DOM.sectorGrid.appendChild(card);
    });
}

function openSectorSeats(sectorName) {
    AppState.selectSector(sectorName);
    DOM.selectedSectorTitle.textContent = `Settore ${sectorName}`;
    DOM.selectedSectorContainer.innerHTML = "";
    DOM.resetSeatDetailCard();
    renderSingleSectorSeats(sectorName);
    DOM.showSeatView();
}

function createRowLabel(rowNumber) {
    const span = document.createElement("span");
    span.classList.add("row-label");
    span.textContent = `Fila ${rowNumber}`;
    return span;
}

function createSeatButton(seat) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("seat");
    button.textContent = seat.seat_number;

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
            handleSeatClick(button, seat);
        });
    }

    return button;
}

function handleSeatClick(button, seat) {
    if (seat.status === "occupato") return;

    if (AppState.selectedSeatId === seat.id_seat) {
        AppState.deselectSeat();
        DOM.clearSeatSelectionUI();
        DOM.resetSeatDetailCard();
        return;
    }

    AppState.selectSeat(seat.id_seat);
    DOM.clearSeatSelectionUI();
    button.classList.add("selected");
    DOM.updateSeatDetailCard(seat);
}

function renderSingleSectorSeats(sectorName) {
    const sectorSeats = AppState.getSeatsBySector(sectorName);
    const grouped = groupSeatsBySectionAndRow(sectorSeats);

    DOM.selectedSectorContainer.innerHTML = "";

    const sectorBox = document.createElement("div");
    sectorBox.classList.add("sector");

    const rows = grouped[sectorName] || {};
    const sortedRows = Object.keys(rows).sort((a, b) => Number(a) - Number(b));

    sortedRows.forEach(rowNumber => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("seat-row");

        const label = createRowLabel(rowNumber);
        rowDiv.appendChild(label);

        rows[rowNumber].forEach(seat => {
            const button = createSeatButton(seat);
            rowDiv.appendChild(button);
        });

        sectorBox.appendChild(rowDiv);
    });

    DOM.selectedSectorContainer.appendChild(sectorBox);
}

function backToSectorView() {
    AppState.clearSector();
    DOM.clearSeatSelectionUI();
    DOM.resetSeatDetailCard();
    DOM.selectedSectorContainer.innerHTML = "";
    DOM.showSectorView();
}

function validateStep1() {
    const selectedSeat = AppState.getSelectedSeat();

    if (!selectedSeat) {
        alert("Seleziona un posto prima di continuare.");
        return false;
    }

    if (selectedSeat.status !== "disponibile") {
        alert("Il posto selezionato non è disponibile.");
        return false;
    }

    return true;
}

function validateStep2() {
    if (!DOM.nome || !DOM.cognome || !DOM.email) {
        console.error("Input mancanti nel DOM");
        return false;
    }

    if (!DOM.nome.value.trim()) {
        alert("Inserisci il nome.");
        DOM.nome.focus();
        return false;
    }

    if (!DOM.cognome.value.trim()) {
        alert("Inserisci il cognome.");
        DOM.cognome.focus();
        return false;
    }

    if (!DOM.email.value.trim()) {
        alert("Inserisci l'email.");
        DOM.email.focus();
        return false;
    }

    return true;
}

function fillSummaryAndHiddenFields() {
    const selectedSeat = AppState.getSelectedSeat();

    if (!selectedSeat) return;

    AppState.setUserData({
        nome: DOM.nome.value.trim(),
        cognome: DOM.cognome.value.trim(),
        email: DOM.email.value.trim(),
        telefono: DOM.telefono.value.trim()
    });

    DOM.summarySector.textContent = selectedSeat.section ?? "--";
    DOM.summaryRow.textContent = selectedSeat.row_number ?? "--";
    DOM.summarySeat.textContent = selectedSeat.seat_number ?? "--";
    DOM.summaryPrice.textContent = getSeatPrice(selectedSeat);

    DOM.hiddenSeatId.value = selectedSeat.id_seat ?? "";
    DOM.hiddenSector.value = selectedSeat.section ?? "";
    DOM.hiddenRow.value = selectedSeat.row_number ?? "";
    DOM.hiddenNumber.value = selectedSeat.seat_number ?? "";
    DOM.hiddenPrice.value = selectedSeat.price ?? "";

    DOM.hiddenNome.value = AppState.userData.nome;
    DOM.hiddenCognome.value = AppState.userData.cognome;
    DOM.hiddenEmail.value = AppState.userData.email;
    DOM.hiddenTelefono.value = AppState.userData.telefono;
}

function goToStep(stepNumber) {
    AppState.setStep(stepNumber);
    DOM.showStep(stepNumber);
}

function setupEventListeners() {
    DOM.backToSectorsBtn.addEventListener("click", () => {
        backToSectorView();
    });

    DOM.confirmSeatBtn.addEventListener("click", () => {
        if (!validateStep1()) return;
        goToStep(2);
    });

    DOM.backToStep1Btn?.addEventListener("click", () => {
        goToStep(1);
    });

    DOM.goToStep3Btn?.addEventListener("click", () => {
        if (!validateStep2()) return;
        fillSummaryAndHiddenFields();
        goToStep(3);
    });

    DOM.backToStep2Btn?.addEventListener("click", () => {
        goToStep(2);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && AppState.currentView === "seats") {
            backToSectorView();
        }
    });

    DOM.paymentForm.addEventListener("submit", (event) => {
        const selectedSeat = AppState.getSelectedSeat();

        if (!selectedSeat) {
            event.preventDefault();
            alert("Nessun posto selezionato.");
            goToStep(1);
            return;
        }

        fillSummaryAndHiddenFields();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    DOM.init();

    console.log("FORM CHECK:", {
        userDataForm: this.userDataForm,
        paymentForm: this.paymentForm,
        backToStep1Btn: this.backToStep1Btn,
        goToStep3Btn: this.goToStep3Btn,
        backToStep2Btn: this.backToStep2Btn
    });
    console.log("INPUT CHECK:", {
        nome: this.nome,
        cognome: this.cognome,
        email: this.email,
        telefono: this.telefono
    });


    if (!window.seatsData || window.seatsData.length === 0) {
        console.error("SEATS NON CARICATI");
        return;
    }

    AppState.setSeatsList(window.seatsData);

    if (window.eventData && window.eventData.id_evento) {
        AppState.setEventId(window.eventData.id_evento);
    }

    DOM.resetSeatDetailCard();
    renderSectorCards();
    DOM.showStep(1);
    setupEventListeners();
});