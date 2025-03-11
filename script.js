// Inicializar el SDK de Pi Network
Pi.init({ version: "2.0" });
// Reemplaza "TU_APP_ID" con el ID de tu app en Pi Network
const appId = "casinopivegas";

// Esperar a que se cargue el SDK de Pi
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Inicializar el SDK de Pi Network
        Pi.init({ version: "2.0" });
    } catch (err) {
        console.error("Error al inicializar Pi SDK:", err);
    }
});

// Manejar el inicio de sesión
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        const scopes = ["username", "payments"]; // Permisos que necesitamos
        const authResult = await Pi.authenticate(scopes);
        
        console.log("Usuario autenticado:", authResult);
        
        // Si la autenticación es exitosa, mostramos el juego
        document.getElementById("game").style.display = "block";
    } catch (err) {
        console.error("Error al autenticar:", err);
    }
});

// Función del juego
document.getElementById("playBtn").addEventListener("click", () => {
    const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
    
    // Generar tres símbolos aleatorios
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    // Mostrar los resultados
    document.getElementById("slot1").innerText = slot1;
    document.getElementById("slot2").innerText = slot2;
    document.getElementById("slot3").innerText = slot3;

    // Determinar si el usuario ha ganado
    if (slot1 === slot2 && slot2 === slot3) {
        document.getElementById("result").innerText = "🎉 You won! 🎉";
    } else {
        document.getElementById("result").innerText = "❌ Try again!";
    }
});
