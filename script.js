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
            const payment = await Pi.createPayment({
                amount: 0.1, // Apuesta de 0.1 Pi
                memo: "Slot machine bet",
                metadata: { game: "slots" }
            }, {
                onReadyForServerApproval: (paymentId) => console.log("Payment ready for approval", paymentId),
                onReadyForServerCompletion: (paymentId) => {
                    console.log("Payment completed", paymentId);
                    playBtn.disabled = false; // Habilita el botón de jugar tras pagar
                },
                onCancel: (error) => console.error("Payment cancelled", error),
                onError: (error) => console.error("Payment error", error)
            });
            console.log("Payment successful:", payment);
        } catch (err) {
            console.error("Payment failed:", err);
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
