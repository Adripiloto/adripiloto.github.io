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

                // Realizar apuesta
                betBtn.addEventListener("click", async () => {
                    resultText.textContent = "";
                    try {
                        const payment = await Pi.createPayment({
                            amount: 0.1,
                            memo: "Slot machine bet",
                            metadata: { game: "slots" },
                        }, {
                            onReadyForServerApproval: (paymentId) => console.log("Payment ready for approval", paymentId),
                            onReadyForServerCompletion: (paymentId) => {
                                console.log("Payment completed", paymentId);
                                playBtn.disabled = false;
                            },
                            onCancel: (error) => console.error("Payment cancelled", error),
                            onError: (error) => console.error("Payment error", error),
                        });
                        console.log("Payment successful:", payment);
                    } catch (err) {
                        console.error("Payment failed:", err);
                        resultText.textContent = "Payment failed.";
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
            })
            .catch(function (error) {
                console.error("Authentication error:", error);
                resultText.textContent = "Authentication failed.";
            });
    });
});
