// Inicializar el SDK de Pi Network
Pi.init({ version: "2.0", sandbox: true });

const appId = "sxfmtqkdbp2hp5v8rmyismfc4brgjbmbjtxakzeitelrlnvkdng04gieebb70e3u";

// Esperar a que se cargue el SDK de Pi
document.addEventListener("DOMContentLoaded", async () => {
    const loginBtn = document.getElementById("loginBtn");
    const resultText = document.getElementById("result");
    let accessToken;
    let username;

    // Autenticar al usuario
    loginBtn.addEventListener("click", () => {
        const scopes = ["payments", "username"];

        function onIncompletePaymentFound(payment) {
            console.log("Incomplete payment found:", payment);
        }

        Pi.authenticate(scopes, onIncompletePaymentFound)
            .then(function (auth) {
                accessToken = auth.accessToken;
                username = auth.user.username;
                console.log("Authentication successful:", auth);
                document.getElementById("game").style.display = "block";
                resultText.textContent = `Welcome, ${username}!`;
                // Inicialización de botones dentro del then, para asegurar que el DOM cargó.
                const betBtn = document.getElementById("betBtn");
                const playBtn = document.getElementById("playBtn");
                const slots = [
                    document.getElementById("slot1"),
                    document.getElementById("slot2"),
                    document.getElementById("slot3"),
                ];
                console.log("betBtn:", betBtn);
                console.log("playBtn:", playBtn);
                if (betBtn && playBtn){ // Añadir comprobacion para asegurar que los botones existen.
                    // Realizar apuesta
                    betBtn.addEventListener("click", async () => {
    resultText.textContent = "Conectando con el servidor de pagos...";
    try {
        const amount = 0.1;
        const memo = "Slot machine bet";
        const response = await fetch("git@github.com:Adripiloto/casino-pi-backend.git", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, memo }),
        });
        const data = await response.json();
        if (data.success) {
            resultText.textContent = "Pago iniciado. Esperando confirmación...";
            // Puedes agregar aquí la lógica para manejar el pago completado
        } else {
            resultText.textContent = "Error al iniciar el pago.";
        }
    } catch (err) {
        console.error("Error en el pago:", err);
        resultText.textContent = "Error en el pago.";
    }
});

                    // Juego de slots
                    playBtn.addEventListener("click", () => {
                        resultText.textContent = "";
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
                }
            })
            .catch(function (error) {
                console.error("Authentication error:", error);
                resultText.textContent = "Authentication failed.";
            });
    });
});
