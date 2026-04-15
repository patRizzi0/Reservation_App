document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".form input");
    const buttons = document.querySelectorAll(".form button");
    const cards = document.querySelectorAll(
        ".register-container, .container-login, .container-profilo"
    );
    const profileLinks = document.querySelectorAll(
        ".container-profilo a:not([href*='home'])"
    );

    // Attiva effetto card selezionata quando entro nella zona
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("is-active-card");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("is-active-card");
        });
    });

    // Stato selected sugli input
    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.classList.add("is-selected");
        });

        input.addEventListener("blur", () => {
            if (input.value.trim() === "") {
                input.classList.remove("is-selected");
            }
        });

        input.addEventListener("input", () => {
            if (input.value.trim() !== "") {
                input.classList.add("is-selected");
            } else {
                input.classList.remove("is-selected");
            }
        });
    });

    // Click feedback sui bottoni
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.add("is-selected");

            setTimeout(() => {
                button.classList.remove("is-selected");
            }, 220);
        });
    });

    // Effetto selected sui link della pagina profilo
    profileLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.classList.add("is-selected");
        });

        link.addEventListener("mouseleave", () => {
            link.classList.remove("is-selected");
        });
    });

    // Toggle password automatico
    const passwordInputs = document.querySelectorAll("input[type='password']");

    passwordInputs.forEach(input => {
        const wrapper = document.createElement("div");
        wrapper.className = "password-field";

        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const toggleBtn = document.createElement("button");
        toggleBtn.type = "button";
        toggleBtn.className = "toggle-password";
        toggleBtn.textContent = "Mostra";

        wrapper.appendChild(toggleBtn);

        toggleBtn.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggleBtn.textContent = isPassword ? "Nascondi" : "Mostra";
            input.focus();
        });
    });
});