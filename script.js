// Reemplaza "TU_APP_ID" con el ID de tu app en Pi Network
const appId = "dph0vlblv8wfdsu96qsdum1diom8xmfjsq9kfrozn4jamqluolgsrrn2l8jpflsx";

// Iniciar sesión con Pi
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        await Pi.authenticate(["payments"], (res) => {
            console.log("Usuario autenticado:", res);
            document.getElementById("game").style.display = "block"; // Muestra el juego tras el login
        });
    } catch (err) {
        console.error("Error al autenticar:", err);
    }
});

document.getElementById("playBtn").addEventListener("click", async () => {
    let result = Math.random() < 0.5 ? "¡Ganaste! 🎉" : "Perdiste 😞";
    document.getElementById("result").innerText = result;

    if (result === "¡Ganaste! 🎉") {
        // Aquí se haría el pago con Pi Network (próximo paso)
    }
});