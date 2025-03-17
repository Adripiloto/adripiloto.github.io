Pi.init({ version: "2.0", sandbox: true });

const loginBtn = document.getElementById("loginBtn");
const gameDiv = document.getElementById("game");
const betBtn = document.getElementById("betBtn");
const spinBtn = document.getElementById("spinBtn");
const slots = document.querySelectorAll(".slot");
const resultDiv = document.getElementById("result");
let accessToken;

loginBtn.addEventListener("click", () => {
    Pi.authenticate(["payments"], (payment) => {
        console.log("Incomplete payment:", payment);
    }).then(auth => {
        accessToken = auth.accessToken;
        gameDiv.style.display = "block";
        loginBtn.style.display = "none";
    }).catch(error => {
        console.error("Authentication error:", error);
    });
});

betBtn.addEventListener("click", () => {
    // Lógica para iniciar el pago (usando tu backend)
    spinBtn.disabled = false;
});

spinBtn.addEventListener("click", () => {
    const symbols = ["", "", ""];
    const spinResult = Array.from(slots).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    slots.forEach((slot, i) => slot.textContent = spinResult[i]);
    if (new Set(spinResult).size === 1) {
        resultDiv.textContent = "¡Ganaste 0.2 Pi!";
        // Lógica para enviar el premio al usuario (usando tu backend)
    } else {
        resultDiv.textContent = "Perdiste.";
    }
    spinBtn.disabled = true;
});
