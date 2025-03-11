// Inicializar el SDK de Pi Network
Pi.init({ version: "2.0" });

// Manejar la autenticación con Pi Network
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        await Pi.authenticate(["username"], (auth) => {
            console.log("Usuario autenticado:", auth);
            document.getElementById("game").style.display = "block"; // Mostrar el juego después del inicio de sesión
            document.getElementById("loginBtn").style.display = "none"; // Ocultar el botón de inicio de sesión
        });
    } catch (err) {
        console.error("Error al autenticar:", err);
    }
});

// Lógica de la máquina tragamonedas
document.getElementById("playBtn").addEventListener("click", () => {
    const symbols = ["🍒", "🍋", "🔔", "⭐", "7️⃣"];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    document.getElementById("slot1").innerText = slot1;
    document.getElementById("slot2").innerText = slot2;
    document.getElementById("slot3").innerText = slot3;

    if (slot1 === slot2 && slot2 === slot3) {
        document.getElementById("result").innerText = "🎉 ¡Felicidades! ¡Has ganado!";
        document.getElementById("result").style.color = "green";
        // Aquí se podría agregar la lógica para procesar un pago con Pi
    } else {
        document.getElementById("result").innerText = "❌ Inténtalo de nuevo.";
        document.getElementById("result").style.color = "red";
    }
});
