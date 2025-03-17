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
    Pi.createPayment({
        amount: "0.1",
        memo: "Apuesta en Slots Game",
    }, (payment) => {
        console.log("Pago incompleto:", payment);
    }).then(payment => {
        console.log("Pago completado:", payment);
        fetch("http://localhost:3000/pagar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentId: payment.identifier,
                accessToken: accessToken,
            }),
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                spinBtn.disabled = false;
            } else {
                resultDiv.textContent = "Error al procesar el pago.";
            }
        }).catch(error => {
            console.error("Error al enviar el pago al backend:", error);
            resultDiv.textContent = "Error de comunicación.";
        });
    }).catch(error => {
        console.error("Error al crear el pago:", error);
        resultDiv.textContent = "Error al iniciar el pago.";
    });
});

spinBtn.addEventListener("click", () => {
    const symbols = ["", "", ""]; // Ejemplo de símbolos
    const spinResult = Array.from(slots).map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    slots.forEach((slot, i) => slot.textContent = spinResult[i]);

    if (new Set(spinResult).size === 1) {
        resultDiv.textContent = "¡Ganaste 0.2 Pi!";
        fetch("http://localhost:3000/premio", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                destinoPublicKey: "CLAVE_PUBLICA_DEL_USUARIO", // Reemplaza con la clave pública del usuario
                cantidad: "0.2",
            }),
        }).then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Premio enviado:", data.result);
            } else {
                resultDiv.textContent = "Error al enviar el premio.";
            }
        }).catch(error => {
            console.error("Error al enviar el premio al backend:", error);
            resultDiv.textContent = "Error de comunicación.";
        });
    } else {
        resultDiv.textContent = "Perdiste.";
    }
    spinBtn.disabled = true;
});
