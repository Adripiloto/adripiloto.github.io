const backendUrl = "http://localhost:3000"; // URL de tu backend local

// Esperar a que el SDK de Pi cargue
document.addEventListener("DOMContentLoaded", function () {
    if (!window.Pi) {
        console.error("Pi SDK no cargado. Asegúrate de que se está importando correctamente.");
        return;
    }

    // Inicializar el SDK con tu clave pública
    Pi.init({ version: "2.0", sandbox: true });

    document.getElementById("loginBtn").addEventListener("click", async function () {
        try {
            const scopes = ["payments"];
            Pi.authenticate(scopes, (user) => {
                console.log("Usuario autenticado:", user);
                document.getElementById("game").style.display = "block"; // Mostrar el juego tras login
                alert("Login exitoso: " + user.uid);
            }, (error) => {
                console.error("Error de autenticación:", error);
                alert("Error al autenticarse con Pi Network.");
            });
        } catch (error) {
            console.error("Error en el login:", error);
        }
    });

    document.getElementById("betButton").addEventListener("click", placeBet);
});

async function placeBet() {
    try {
        const user = Pi.currentUser();
        if (!user) {
            alert("Debes iniciar sesión antes de apostar.");
            return;
        }

        const response = await fetch(`${backendUrl}/create-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userUid: user.uid }),
        });

        const data = await response.json();
        if (data.success) {
            alert("Apuesta realizada con éxito. ID de pago: " + data.paymentId);
        } else {
            alert("Error al realizar la apuesta.");
        }
    } catch (error) {
        console.error("Error al realizar la apuesta:", error);
    }
}
