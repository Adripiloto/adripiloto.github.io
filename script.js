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
                if (betBtn && playBtn) { // Añadir comprobacion para asegurar que los botones existen.
                    // Realizar apuesta
                    betBtn.addEventListener("click", async () => {
                        resultText.textContent = "Conectando con el servidor de pagos...";
                        try {
                            const paymentData = {
                                amount: 0.1,
                                memo: "Slot machine bet",
                                metadata: { orderId: 123 }
                            };

                            const paymentCallbacks = {
                                onReadyForServerApproval: (paymentDTO) => {
                                    sendPaymentApprove(paymentDTO);
                                },
                                onReadyForServerCompletion: (paymentDTO, txid) => {
                                    sendPaymentComplete(paymentDTO, txid);
                                },
                                onCancel: (paymentDTO) => {
                                    sendPaymentCancel(paymentDTO);
                                },
                                onError: (paymentDTO) => {
                                    sendPaymentError(paymentDTO);
                                },
                                onIncompletePaymentFound: (paymentDTO) => {
                                    sendPaymentComplete(paymentDTO, paymentDTO.transaction.txid);
                                }
                            };

                            Pi.createPayment(paymentData, paymentCallbacks);

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

    function sendPaymentApprove(paymentDTO) {
        console.log("Enviando solicitud POST a:", "https://comic-glowworm-harmless.ngrok-free.app");
        console.log("Datos:", {
            paymentId: paymentDTO.identifier,
            accessToken: accessToken,
        });
        fetch("http://127.0.0.1:5000/payment/approve", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                paymentId: paymentDTO.identifier,
                accessToken: accessToken,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de /payment/approve:", data);
        })
        .catch(error => {
            console.error("Error en /payment/approve:", error);
        });
    }

    function sendPaymentComplete(paymentDTO, txid) {
        console.log("Enviando solicitud POST a:", "http://127.0.0.1:5000/payment/complete");
        console.log("Datos:", {
            paymentId: paymentDTO.identifier,
            txid: txid,
            accessToken: accessToken,
        });
        fetch("http://127.0.0.1:5000/payment/complete", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                paymentId: paymentDTO.identifier,
                txid: txid,
                accessToken: accessToken,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de /payment/complete:", data);
        })
        .catch(error => {
            console.error("Error en /payment/complete:", error);
        });
    }

    function sendPaymentCancel(paymentDTO) {
        console.log("Enviando solicitud POST a:", "http://127.0.0.1:5000/payment/cancel");
        console.log("Datos:", {
            paymentId: paymentDTO.identifier,
            accessToken: accessToken,
        });
        fetch("http://127.0.0.1:5000/payment/cancel", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                paymentId: paymentDTO.identifier,
                accessToken: accessToken,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de /payment/cancel:", data);
        })
        .catch(error => {
            console.error("Error en /payment/cancel:", error);
        });
    }

    function sendPaymentError(paymentDTO) {
        console.log("Enviando solicitud POST a:", "http://127.0.0.1:5000/payment/error");
        console.log("Datos:", {
            paymentId: paymentDTO.identifier,
            accessToken: accessToken,
        });
        fetch("http://127.0.0.1:5000/payment/error", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                paymentId: paymentDTO.identifier,
                accessToken: accessToken,
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta de /payment/error:", data);
        })
        .catch(error => {
            console.error("Error en /payment/error:", error);
        });
    }
});
