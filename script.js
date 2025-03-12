// Inicializar el SDK de Pi Network
Pi.init({ version: "2.0" });

const appId = "dph0vlblv8wfdsu96qsdum1diom8xmfjsq9kfrozn4jamqluolgsrrn2l8jpflsx";

// Esperar a que se cargue el SDK de Pi
document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.getElementById("loginBtn");
    const betBtn = document.getElementById("betBtn");
    const playBtn = document.getElementById("playBtn");
    const resultText = document.getElementById("result");
    const slots = [document.getElementById("slot1"), document.getElementById("slot2"), document.getElementById("slot3")];
    let user;

    // Login con Pi Network
    loginBtn.addEventListener("click", async () => {
        try {
            user = await Pi.authenticate(["payments"], (res) => res);
            console.log("User authenticated:", user);
            document.getElementById("game").style.display = "block";
        } catch (err) {
            console.error("Authentication error:", err);
        }
    });

    // Realizar apuesta
       betBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("http://192.168.1.90:3000/initiate-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: 0.1, memo: "Slot machine bet" })
            });

            const data = await response.json();
            if (data.success) {
                console.log("Payment initialized:", data.paymentId);
                playBtn.disabled = false;
            } else {
                console.error("Payment initialization failed:", data.error);
            }
        } catch (err) {
            console.error("Error placing bet:", err);
        }
    });

    // Juego de slots
    playBtn.addEventListener("click", () => {
        const symbols = ["🍒", "🍋", "🍊", "🍉", "⭐", "🔔"];
        const spinResult = symbols.map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        slots.forEach((slot, i) => slot.textContent = spinResult[i]);
        
        if (new Set(spinResult).size === 1) {
            resultText.textContent = "🎉 You won! 🎉";
        } else {
            resultText.textContent = "😞 You lost. Try again!";
        }
        playBtn.disabled = true;
    });
});
